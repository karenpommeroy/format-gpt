import { ChatCompletionMessageParam } from "openai/resources";
import { Format, FormatOptions, IAttribute, ICsvFormatOptions } from "./Common";
export declare const isCsvFormatOptions: (item: any) => item is ICsvFormatOptions;
export declare const isFormatOptions: (item: any) => item is ICsvFormatOptions;
export declare const isAttributeArray: (item: any) => item is IAttribute[];
export declare const getOutputLanguageName: (code?: string) => string | undefined;
export declare const getOutputLanguagePrompt: (code: string) => string;
export declare const getOutputLanguageMessage: (code: string) => ChatCompletionMessageParam;
export declare const getFormattedMessage: (item: ChatCompletionMessageParam, format?: Format, options?: FormatOptions) => ChatCompletionMessageParam & {
    content: string;
};
export declare const getFormattedText: (format?: Format, options?: FormatOptions) => string;
export declare const getAttributesText: (attributes: IAttribute[]) => string;
export declare const csvToArray: (strData: string, header?: string[], strDelimiter?: string) => {
    header: any[];
    rows: any[][];
};
