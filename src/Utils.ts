import $_ from "lodash";
import {ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum} from "openai";

import {Format, FormatExpressions, FormatOptions, IAttribute, ICsvFormatOptions} from "./Common";

export const isCsvFormatOptions = (item: any): item is ICsvFormatOptions =>
    "columnSeparator" in item || "rowSeparator" in item;

export const isFormatOptions = (item: any): item is ICsvFormatOptions => "attributes" in item;

export const isAttributeArray = (item: any): item is IAttribute[] =>
    $_.isArray(item) && $_.some(["name", "type", "minLength", "maxLength", "custom"], (prop) => prop in item[0]);

export const getOutputLanguageName = (code = "en") => {
    const languageNames = new Intl.DisplayNames(["en"], {type: "language"});

    return languageNames.of(code);
};

export const getOutputLanguagePrompt = (code: string) =>
    `You should write output in ${getOutputLanguageName(code)} language only.`;

export const getOutputLanguageMessage = (code: string): ChatCompletionRequestMessage => ({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: getOutputLanguagePrompt(code),
});

export const getFormattedMessage = (item: ChatCompletionRequestMessage, format: Format, options?: FormatOptions) =>
    $_.assign({}, item, {content: `${item.content} ${getFormattedText(format, options)}`});

export const getFormattedText = (format: Format = "text", options?: FormatOptions) => {
    const parts = [];

    parts.push(`You should write output only in ${FormatExpressions[format]} format.`);

    if (!options) return $_.join(parts, " ");

    if (isFormatOptions(options)) {
        parts.push(`You should include the following in it: ${getAttributesText(options.attributes)}.`);
    }

    if (isCsvFormatOptions(options)) {
        const {columnSeparator = ",", rowSeparator = "\n"} = options;

        parts.push(`You should use ${columnSeparator} as column separator.`);
        parts.push(`You should use ${rowSeparator} as row separator.`);
    }

    return $_.join(parts, " ");
};

export const getAttributesText = (attributes: IAttribute[]): string => {
    const attributeStrings = $_.map(attributes, (item) => {
        let type = "";
        let minLength = "";
        let maxLength = "";
        let custom = "";

        if (isAttributeArray(item.type)) {
            return `${item.name} (array: ${getAttributesText(item.type)})`;
        }

        if (item.type) type += item.type;
        if (item.minLength) minLength += `min length ${item.minLength} characters`;
        if (item.maxLength) maxLength += `max length ${item.maxLength} characters`;
        if (item.custom) custom += item.custom;

        const length = $_.join($_.compact([minLength, maxLength]), " and ");
        const details = [type, length, custom];
        const hasDetails = $_.some(details, (item) => !$_.isEmpty(item));

        return `${item.name}${hasDetails ? ` (${$_.join($_.compact(details), ", ")})` : ""}`;
    });

    return $_.join(attributeStrings, ", ");
};

export const csvToArray = (strData: string, header = [], strDelimiter = ","): {header: any[]; rows: any[][]} => {
    if (!strData) return {header, rows: []};

    const objPattern = new RegExp(
        `(\\${strDelimiter}|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\${strDelimiter}\\r\\n]*))`,
        "gi",
    );

    const arrData: [any[]] = [[]];
    let arrMatches = null;

    while ((arrMatches = objPattern.exec(strData))) {
        const strMatchedDelimiter = arrMatches[1];
        let strMatchedValue;

        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            arrData.push([]);
        }

        if (arrMatches[2]) {
            strMatchedValue = $_.replace(arrMatches[2], /""/g, "'");
        } else {
            strMatchedValue = arrMatches[3];
        }
        if (strMatchedValue) {
            arrData[arrData.length - 1].push(strMatchedValue);
        }
    }

    return {
        header: header ?? $_.first(arrData),
        rows: $_.omitBy(header ? arrData : $_.tail(arrData), $_.isEmpty) as any[][],
    };
};
