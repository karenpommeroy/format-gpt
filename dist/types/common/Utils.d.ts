import { ChatCompletionRequestMessage } from "./ChatGpt";
import { FormatOptions, IAttribute } from "./FormatOptions";
import { Format } from "./Formats";
export declare const getOutputLanguageName: (code?: string) => string | undefined;
export declare const getOutputLanguagePrompt: (code?: string) => string;
export declare const getOutputLanguageMessage: (code?: string) => ChatCompletionRequestMessage;
export declare const getFormattedMessage: (item: ChatCompletionRequestMessage, format: Format, options?: FormatOptions) => ChatCompletionRequestMessage & {
    content: string;
};
export declare const getFormattedText: (format: Format, options?: FormatOptions) => string;
export declare const getAttributesText: (attributes: IAttribute[]) => string;
