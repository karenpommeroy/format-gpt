import { ChatCompletionRequestMessage, CreateChatCompletionRequest } from "openai";
import { IOutputConfig } from "./Common";
export declare const formatGptRequest: (request: CreateChatCompletionRequest, output?: IOutputConfig) => CreateChatCompletionRequest & {
    messages: ChatCompletionRequestMessage[];
};
export declare const formatGptMessages: (messages: ChatCompletionRequestMessage[], output?: IOutputConfig) => ChatCompletionRequestMessage[];
export declare const formatGptPrompt: (prompt: string, output?: IOutputConfig) => string;
