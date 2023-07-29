import { AxiosRequestConfig } from "axios";
import { CreateChatCompletionRequest, OpenAIApi } from "openai";
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
    constructor(openai: OpenAIApi);
    makeRequestToChatGpt(request: CreateChatCompletionRequest, options: AxiosRequestConfig<any> | undefined, output?: IOutputConfig): Promise<ChatGptResult>;
    makeStreamRequestToChatGpt(request: CreateChatCompletionRequest, options: AxiosRequestConfig<any> | undefined, output?: IOutputConfig, onUpdate?: UpdateCallback, onTransform?: TransformCallback, onEnd?: EndCallback): Promise<ChatGptResult>;
}
