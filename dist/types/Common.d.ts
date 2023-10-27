declare const ALL_FORMATS: readonly ["array", "csv", "html", "html-table", "json", "json-list", "markdown", "gfm-markdown", "markdown-table", "text", "xml", "yaml"];
export type FormatTuple = typeof ALL_FORMATS;
export type Format = FormatTuple[number];
export declare enum Formats {
    ARRAY = "array",
    CSV = "csv",
    HTML = "html",
    HTMLTABLE = "html-table",
    JSON = "json",
    JSONLIST = "json-list",
    MARKDOWN = "markdown",
    GFMMARKDOWN = "gfm-markdown",
    MARKDOWNTABLE = "markdown-table",
    TEXT = "text",
    XML = "xml",
    YAML = "yaml"
}
export interface IOutputConfig {
    format?: Format;
    options?: FormatOptions;
    language?: string;
    size?: number;
}
export interface IAttribute {
    name: string;
    type: "boolean" | "integer" | "decimal" | "string" | "date" | Array<IAttribute>;
    minLength?: number;
    maxLength?: number;
    custom?: string;
}
export interface IFormatOptions {
    attributes: Array<IAttribute>;
}
export interface ICsvFormatOptions extends IFormatOptions {
    columnSeparator?: string;
    rowSeparator?: string;
}
export type FormatOptions = IFormatOptions | ICsvFormatOptions | undefined;
export declare const FormatExpressions: {
    array: string;
    csv: string;
    html: string;
    "html-table": string;
    json: string;
    "json-list": string;
    markdown: string;
    "gfm-markdown": string;
    "markdown-table": string;
    text: string;
    xml: string;
    yaml: string;
};
export {};
