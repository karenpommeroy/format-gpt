import {AxiosRequestConfig} from "axios";
import {IncomingMessage} from "http";
import $_ from "lodash";
import {CreateChatCompletionRequest, OpenAIApi} from "openai";

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
        [Formats.MARKDOWNTABLE]: $_.identity,
        [Formats.XML]: $_.identity,
        [Formats.YAML]: $_.identity,
    };

    public constructor(private openai: OpenAIApi) {
        this.createChatCompletion = this.createChatCompletion.bind(this);
        this.createChatCompletionStream = this.createChatCompletionStream.bind(this);
    }

    public async createChatCompletion(
        request: CreateChatCompletionRequest,
        options: AxiosRequestConfig<any> | undefined,
        output: IOutputConfig = {},
    ): Promise<ChatGptResult> {
        const newRequest = formatGptRequest(request, output);
        const outputParser = this.outputParsers[output.format ?? "text"] ?? $_.identity;

        const response = await this.openai.createChatCompletion(newRequest, options as any);
        const id = $_.get(response, "data.id");
        const content = $_.get(response, "data.choices.0.message.content", "");

        return {id, content: outputParser(content)};
    }

    public async createChatCompletionStream(
        request: CreateChatCompletionRequest,
        options: AxiosRequestConfig<any> | undefined,
        output: IOutputConfig = {},
        onUpdate?: UpdateCallback,
        onTransform?: TransformCallback,
        onEnd?: EndCallback,
    ): Promise<ChatGptResult> {
        const newRequest = formatGptRequest($_.assign({}, request, {stream: true}), output);
        const newOptions: any = $_.assign({}, options, {responseType: "stream"});
        const response = await this.openai.createChatCompletion(newRequest, newOptions);
        const stream = response.data as unknown as IncomingMessage;
        const size = $_.get(output, "size");

        return await new Promise<any>((resolve, reject) => {
            const streamResult: StreamResult = {id: "", chunks: []};

            let dataText = "";

            const jsonStreamReader = async (data: Buffer) => {
                const jsonEntryRegex = /(?<!^)(\{+.*\}+),?/gs;
                const payloads = data.toString().split("\n\n");
                for (const payload of payloads) {
                    if (payload.includes("[DONE]")) return;
                    if (payload.startsWith("data:")) {
                        try {
                            const data = JSON.parse(payload.replace("data: ", ""));
                            const chunk = $_.get(data, "choices[0].delta.content");

                            if (!chunk) continue;

                            dataText += chunk;

                            const matches = dataText.match(jsonEntryRegex);
                            const nextMatch = $_.first(matches);

                            if (!nextMatch) continue;

                            try {
                                const entry = JSON.parse($_.trimEnd(nextMatch, " ,\r\n\t"));
                                const entryWithId = {id: $_.toString(Date.now()), ...entry};
                                const entryAfterTransform = $_.isFunction(onTransform)
                                    ? onTransform(entryWithId)
                                    : entryWithId;

                                dataText = $_.replace(dataText, nextMatch, "");

                                streamResult.id = data.id;
                                streamResult.chunks.push(entryAfterTransform);

                                if (!$_.isFunction(onUpdate)) continue;

                                onUpdate({
                                    id: data.id,
                                    data: $_.isFunction(onTransform) ? await entryAfterTransform : entryAfterTransform,
                                    progress: !$_.isNil(size) ? $_.size(streamResult.chunks) / size : undefined,
                                });
                            } catch (error) {
                                // Chunk incomplete, parsing not possible
                                continue;
                            }
                        } catch (error) {
                            console.log(`Chunk could not be parsed.\n${error}`);
                        }
                    }
                }
            };

            const arrayStreamReader = async (data: Buffer) => {
                const arrayEntryRegex = /\[(?:.*)\][,|\n]+/g;
                const payloads = data.toString().split("\n\n");
                for (const payload of payloads) {
                    if (payload.includes("[DONE]")) return;
                    if (payload.startsWith("data:")) {
                        try {
                            const data = JSON.parse(payload.replace("data: ", ""));
                            const chunk = $_.get(data, "choices[0].delta.content");

                            if (!chunk) continue;

                            dataText += chunk;

                            const matches = dataText.match(arrayEntryRegex);
                            const nextMatch = $_.first(matches);

                            if (!nextMatch) continue;

                            try {
                                const entry = JSON.parse($_.trim(nextMatch, " ,\r\n\t"));
                                const entryAfterTransform = $_.isFunction(onTransform) ? onTransform(entry) : entry;

                                dataText = $_.replace(dataText, nextMatch, "");

                                streamResult.id = data.id;
                                streamResult.chunks.push(entryAfterTransform);

                                if (!$_.isFunction(onUpdate)) continue;

                                onUpdate({
                                    id: data.id,
                                    data: $_.isFunction(onTransform) ? await entryAfterTransform : entryAfterTransform,
                                    progress: !$_.isNil(size) ? $_.size(streamResult.chunks) / size : undefined,
                                });
                            } catch (error) {
                                // Chunk incomplete, parsing not possible
                                continue;
                            }
                        } catch (error) {
                            console.log(`Chunk could not be parsed.\n${error}`);
                            continue;
                        }
                    }
                }
            };

            const textStreamReader = (data: Buffer) => {
                const payloads = data.toString().split("\n\n");
                for (const payload of payloads) {
                    if (payload.includes("[DONE]")) return;
                    if (payload.startsWith("data:")) {
                        try {
                            const data = JSON.parse(payload.replace("data: ", ""));
                            const chunk = $_.get(data, "choices[0].delta.content");

                            if (!chunk) continue;

                            streamResult.id = data.id;
                            streamResult.chunks += chunk;

                            if (!$_.isFunction(onUpdate)) continue;

                            onUpdate({
                                id: data.id,
                                data: chunk,
                                progress: !$_.isNil(size) ? $_.size(streamResult.chunks) / size : undefined,
                            });
                        } catch (error) {
                            console.log(`Chunk could not be parsed.\n${error}`);
                            continue;
                        }
                    }
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
                [Formats.MARKDOWNTABLE]: textStreamReader,
                [Formats.XML]: textStreamReader,
                [Formats.YAML]: textStreamReader,
            };

            const reader = outputStreamReaders[$_.get(output, "format", Formats.TEXT)];

            stream.on("data", reader);

            stream.on("end", () => {
                setTimeout(async () => {
                    const content = $_.isFunction(onTransform)
                        ? await Promise.all(streamResult.chunks)
                        : streamResult.chunks;
                    const data = {id: streamResult.id, content};

                    $_.isFunction(onEnd) && onEnd(data);
                    resolve(data);
                }, 10);
            });

            stream.on("error", (error: Error) => {
                const data = {id: streamResult.id, error};

                $_.isFunction(onEnd) && onEnd(data);
                reject(data);
            });

            const signal = $_.get(options, "signal") as AbortSignal;
            if (!signal) return;

            signal.addEventListener("abort", () => {
                response.request.abort();
                reject({message: signal.reason});
            });
        });
    }
}
