import { ChatCompletionCreateParams, ChatCompletionMessage } from "openai/resources";
import { IOutputConfig } from "./Common";
export declare const formatGptRequest: (request: ChatCompletionCreateParams, output?: IOutputConfig) => ChatCompletionCreateParams & {
    messages: (ChatCompletionMessage | {
        role: string;
        content: string;
    })[];
};
export declare const formatGptMessages: (messages: ChatCompletionMessage[], output?: IOutputConfig) => (ChatCompletionMessage | {
    role: string;
    content: string;
})[];
export declare const formatGptPrompt: (prompt: string, output?: IOutputConfig) => string;
