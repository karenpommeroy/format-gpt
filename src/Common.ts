const ALL_FORMATS = <const>[
    "array",
    "csv",
    "html",
    "html-table",
    "json",
    "json-list",
    "markdown",
    "gfm-markdown",
    "markdown-table",
    "text",
    "xml",
    "yaml",
];

export type FormatTuple = typeof ALL_FORMATS;

export type Format = FormatTuple[number];

export enum Formats {
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
    YAML = "yaml",
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

export const FormatExpressions = {
    [Formats.ARRAY]: "JavaScript Array of Arrays",
    [Formats.CSV]: "CSV",
    [Formats.HTML]: "HTML",
    [Formats.HTMLTABLE]: "HTML Table",
    [Formats.JSON]: "JSON",
    [Formats.JSONLIST]: "JSON List",
    [Formats.MARKDOWN]: "Markdown",
    [Formats.GFMMARKDOWN]: "GFM Markdown",
    [Formats.MARKDOWNTABLE]: "Markdown Table",
    [Formats.TEXT]: "Plain Text",
    [Formats.XML]: "XML",
    [Formats.YAML]: "YAML",
};
