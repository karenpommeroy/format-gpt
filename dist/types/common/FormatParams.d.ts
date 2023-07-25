import { ChatCompletionRequestMessage, CreateChatCompletionRequest } from "./ChatGpt";
import { FormatOptions } from "./FormatOptions";
import { Format } from "./Formats";
export interface IFormatChatGptParams {
    format: Format;
    options?: FormatOptions;
    language?: string;
}
export interface IFormatChatGptRequestParams extends IFormatChatGptParams {
    request: CreateChatCompletionRequest;
}
export interface IFormatChatGptMessagesParams extends IFormatChatGptParams {
    messages: Array<ChatCompletionRequestMessage>;
}
export interface IFormatChatGptPromptParams extends IFormatChatGptParams {
    prompt: string;
}
