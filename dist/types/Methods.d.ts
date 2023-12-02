import { ChatCompletionCreateParams, ChatCompletionMessageParam } from "openai/resources";
import { IOutputConfig } from "./Common";
export declare const formatGptRequest: (request: ChatCompletionCreateParams, output?: IOutputConfig) => ChatCompletionCreateParams & {
    messages: (import("openai/resources").ChatCompletionSystemMessageParam | import("openai/resources").ChatCompletionUserMessageParam | import("openai/resources").ChatCompletionAssistantMessageParam | import("openai/resources").ChatCompletionToolMessageParam | import("openai/resources").ChatCompletionFunctionMessageParam | {
        role: string;
        content: string;
    })[];
};
export declare const formatGptMessages: (messages: ChatCompletionMessageParam[], output?: IOutputConfig) => (import("openai/resources").ChatCompletionSystemMessageParam | import("openai/resources").ChatCompletionUserMessageParam | import("openai/resources").ChatCompletionAssistantMessageParam | import("openai/resources").ChatCompletionToolMessageParam | import("openai/resources").ChatCompletionFunctionMessageParam | {
    role: string;
    content: string;
})[];
export declare const formatGptPrompt: (prompt: string, output?: IOutputConfig) => string;
