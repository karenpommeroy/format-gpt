import {AxiosRequestConfig} from "axios";
import $_ from "lodash";
import {OpenAI} from "openai";
import {RequestOptions} from "openai/core";
import {
    ChatCompletionChunk,
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionCreateParamsStreaming,
} from "openai/resources";

import {Formats, IOutputConfig} from "./Common";
import {formatGptRequest} from "./Methods";

export type StreamResult = {
    id: string;
    chunks: Promise<any>[];
};

export type ChatGptResult = {
    id: string;
    content: any;
};

export type UpdateCallback = (params: Partial<UpdateCallbackParams>) => void;
export type TransformCallback = (params: Partial<TransformCallbackParams>) => Promise<any>;
export type EndCallback = (params: Partial<EndCallbackParams>) => void;

export type UpdateCallbackParams = {
    id: string;
    data: any;
    progress?: number;
};

export type TransformCallbackParams = {
    item: any;
};

export type EndCallbackParams = {
    id: string;
    data?: any;
    error?: Error;
};

export class Formatter {
    private outputParsers = {
        [Formats.ARRAY]: JSON.parse,
        [Formats.JSON]: JSON.parse,
        [Formats.JSONLIST]: JSON.parse,
        [Formats.TEXT]: $_.identity,
        [Formats.CSV]: $_.identity,
        [Formats.HTML]: $_.identity,
        [Formats.HTMLTABLE]: $_.identity,
        [Formats.MARKDOWN]: $_.identity,
        [Formats.GFMMARKDOWN]: $_.identity,
        [Formats.MARKDOWNTABLE]: $_.identity,
        [Formats.XML]: $_.identity,
        [Formats.YAML]: $_.identity,
    };

    public constructor(private openai: OpenAI) {
        this.createChatCompletion = this.createChatCompletion.bind(this);
        this.createChatCompletionStream = this.createChatCompletionStream.bind(this);
    }

    public async createChatCompletion(
        request: ChatCompletionCreateParamsNonStreaming,
        options: AxiosRequestConfig<any> | undefined,
        output: IOutputConfig = {},
    ): Promise<ChatGptResult> {
        const newRequest = formatGptRequest(request, output) as ChatCompletionCreateParamsNonStreaming;
        const outputParser = this.outputParsers[output.format ?? "text"] ?? $_.identity;

        const response = await this.openai.chat.completions.create(newRequest, options as RequestOptions);
        const id = $_.get(response, "id");
        const content = $_.get(response, "choices.0.message.content", "");

        return {id, content: outputParser(content)};
    }

    public async createChatCompletionStream(
        request: ChatCompletionCreateParamsStreaming,
        options: AxiosRequestConfig<any> | undefined,
        output: IOutputConfig = {},
        onUpdate?: UpdateCallback,
        onTransform?: TransformCallback,
        onEnd?: EndCallback,
    ): Promise<ChatGptResult> {
        const newRequest = formatGptRequest(
            $_.assign({}, request, {stream: true}),
            output,
        ) as ChatCompletionCreateParamsStreaming;
        const newOptions: any = $_.assign({}, options, {responseType: "stream"});
        const response = await this.openai.chat.completions.create(newRequest, newOptions);
        const size = $_.get(output, "size");

        return await new Promise<any>(async (resolve, reject) => {
            const streamResult: StreamResult = {id: "", chunks: []};

            let dataText = "";

            const jsonStreamReader = async (data: ChatCompletionChunk) => {
                const jsonEntryRegex = /(?<!^)(\{+.*\}+),?/gs;

                try {
                    const chunk = $_.get(data, "choices[0].delta.content");

                    if (!chunk) return;

                    dataText += chunk;

                    const matches = dataText.match(jsonEntryRegex);
                    const nextMatch = $_.first(matches);

                    if (!nextMatch) return;

                    try {
                        const entry = JSON.parse($_.trimEnd(nextMatch, " ,\r\n\t"));
                        const entryWithId = {id: $_.toString(Date.now()), ...entry};
                        const entryAfterTransform = $_.isFunction(onTransform) ? onTransform(entryWithId) : entryWithId;

                        dataText = $_.replace(dataText, nextMatch, "");

                        streamResult.id = data.id;
                        streamResult.chunks.push(entryAfterTransform);

                        if (!$_.isFunction(onUpdate)) return;

                        onUpdate({
                            id: data.id,
                            data: $_.isFunction(onTransform) ? await entryAfterTransform : entryAfterTransform,
                            progress: !$_.isNil(size) ? $_.size(streamResult.chunks) / size : undefined,
                        });
                    } catch (error) {
                        // Chunk incomplete, parsing not possible
                        return;
                    }
                } catch (error) {
                    console.log(`Chunk could not be parsed.\n${error}`);
                    return;
                }
            };

            const arrayStreamReader = async (data: ChatCompletionChunk) => {
                const arrayEntryRegex = /\[(?:.*)\][,|\n]+/g;
                try {
                    const chunk = $_.get(data, "choices[0].delta.content");

                    if (!chunk) return;

                    dataText += chunk;

                    const matches = dataText.match(arrayEntryRegex);
                    const nextMatch = $_.first(matches);

                    if (!nextMatch) return;

                    try {
                        const entry = JSON.parse($_.trim(nextMatch, " ,\r\n\t"));
                        const entryAfterTransform = $_.isFunction(onTransform) ? onTransform(entry) : entry;

                        dataText = $_.replace(dataText, nextMatch, "");

                        streamResult.id = data.id;
                        streamResult.chunks.push(entryAfterTransform);

                        if (!$_.isFunction(onUpdate)) return;

                        onUpdate({
                            id: data.id,
                            data: $_.isFunction(onTransform) ? await entryAfterTransform : entryAfterTransform,
                            progress: !$_.isNil(size) ? $_.size(streamResult.chunks) / size : undefined,
                        });
                    } catch (error) {
                        // Chunk incomplete, parsing not possible
                        return;
                    }
                } catch (error) {
                    console.log(`Chunk could not be parsed.\n${error}`);
                    return;
                }
            };

            const textStreamReader = (data: ChatCompletionChunk) => {
                try {
                    const chunk = $_.get(data, "choices[0].delta.content") as any;
                    if (!chunk) return;

                    streamResult.id = data.id;
                    streamResult.chunks += chunk;

                    if (!$_.isFunction(onUpdate)) return;

                    onUpdate({
                        id: data.id,
                        data: chunk,
                        progress: !$_.isNil(size) ? $_.size(streamResult.chunks) / size : undefined,
                    });
                } catch (error) {
                    console.log(`Chunk could not be parsed.\n${error}`);
                    return;
                }
            };

            const outputStreamReaders = {
                [Formats.JSON]: jsonStreamReader,
                [Formats.JSONLIST]: jsonStreamReader,
                [Formats.ARRAY]: arrayStreamReader,
                [Formats.TEXT]: textStreamReader,
                [Formats.CSV]: textStreamReader,
                [Formats.HTML]: textStreamReader,
                [Formats.HTMLTABLE]: textStreamReader,
                [Formats.MARKDOWN]: textStreamReader,
                [Formats.GFMMARKDOWN]: textStreamReader,
                [Formats.MARKDOWNTABLE]: textStreamReader,
                [Formats.XML]: textStreamReader,
                [Formats.YAML]: textStreamReader,
            };

            const reader = outputStreamReaders[$_.get(output, "format", Formats.TEXT)];

            const signal = $_.get(response.controller, "signal") as AbortSignal;
            if (!signal) return;

            signal.addEventListener("abort", () => {
                response.controller.abort();
                reject({message: signal.reason});
            });

            for await (const part of response) {
                reader(part);
            }

            const content = $_.isFunction(onTransform) ? await Promise.all(streamResult.chunks) : streamResult.chunks;
            const data = {id: streamResult.id, content};

            $_.isFunction(onEnd) && onEnd(data);

            resolve(data);
        });
    }
}
