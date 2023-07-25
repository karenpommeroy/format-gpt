export interface IAttribute {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "integer" | "decimal" | Array<IAttribute>;
    minLength?: number;
    maxLength?: number;
    custom?: string;
}

export interface IFormatOptions {
    attributes: Array<IAttribute>;
}

export interface IArrayFormatOptions extends IFormatOptions {}
export interface IHtmlFormatOptions extends IFormatOptions {}
export interface IJsonFormatOptions extends IFormatOptions {}
export interface IJsonListFormatOptions extends IFormatOptions {}
export interface IMarkdownFormatOptions extends IFormatOptions {}
export interface ITableFormatOptions extends IFormatOptions {}
export interface ITextFormatOptions extends IFormatOptions {}
export interface IXmlFormatOptions extends IFormatOptions {}
export interface IYamlFormatOptions extends IFormatOptions {}
export interface ICsvFormatOptions extends IFormatOptions {
    columnSeparator?: string;
    rowSeparator?: string;
}

export type FormatOptions =
    IArrayFormatOptions |
    ICsvFormatOptions |
    IHtmlFormatOptions |
    IJsonFormatOptions |
    IJsonListFormatOptions |
    IMarkdownFormatOptions |
    ITableFormatOptions |
    ITextFormatOptions |
    IXmlFormatOptions |
    IYamlFormatOptions;

export const isCsvFormatOptions = (item: ICsvFormatOptions): item is ICsvFormatOptions =>
    "columnSeparator" in item || "rowSeparator" in item;

export const isFormatOptions = (item: ICsvFormatOptions): item is ICsvFormatOptions =>
    "attributes" in item;