export type ChatCompletionRequestMessageRole = "system" | "user" | "assistant";
export declare enum ChatCompletionRequestMessageRoleEnum {
    System = "system",
    User = "user",
    Assistant = "assistant"
}
export declare type CreateChatCompletionRequestStop = Array<string> | string;
export interface ChatCompletionRequestMessage {
    "role": ChatCompletionRequestMessageRole;
    "content": string;
    "name"?: string;
}
export interface CreateChatCompletionRequest {
    "model": string;
    "messages": Array<ChatCompletionRequestMessage>;
    "temperature"?: number | null;
    "top_p"?: number | null;
    "n"?: number | null;
    "stream"?: boolean | null;
    "stop"?: CreateChatCompletionRequestStop;
    "max_tokens"?: number;
    "presence_penalty"?: number | null;
    "frequency_penalty"?: number | null;
    "logit_bias"?: object | null;
    "user"?: string;
}
