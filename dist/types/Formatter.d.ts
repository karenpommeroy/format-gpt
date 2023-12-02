import { AxiosRequestConfig } from "axios";
import { OpenAI } from "openai";
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming } from "openai/resources";
import { IOutputConfig } from "./Common";
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
export declare class Formatter {
    private openai;
    private outputParsers;
    constructor(openai: OpenAI);
    createChatCompletion(request: ChatCompletionCreateParamsNonStreaming, options: AxiosRequestConfig<any> | undefined, output?: IOutputConfig): Promise<ChatGptResult>;
    createChatCompletionStream(request: ChatCompletionCreateParamsStreaming, options: AxiosRequestConfig<any> | undefined, output?: IOutputConfig, onUpdate?: UpdateCallback, onTransform?: TransformCallback, onEnd?: EndCallback, signal?: AbortSignal): Promise<ChatGptResult>;
}
