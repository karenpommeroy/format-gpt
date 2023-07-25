import { ChatCompletionRequestMessage } from "../common/ChatGpt";
import { IFormatChatGptMessagesParams, IFormatChatGptPromptParams, IFormatChatGptRequestParams } from "../common/FormatParams";
export declare const formatChatGptRequest: (params: IFormatChatGptRequestParams) => import("../common/ChatGpt").CreateChatCompletionRequest & {
    messages: ChatCompletionRequestMessage[];
};
export declare const formatChatGptMessages: (params: IFormatChatGptMessagesParams) => ChatCompletionRequestMessage[];
export declare const formatChatGptPrompt: (params: IFormatChatGptPromptParams) => string;
export default formatChatGptPrompt;
