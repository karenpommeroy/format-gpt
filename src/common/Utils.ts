import $_ from "lodash";

import {ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum} from "./ChatGpt";
import {FormatOptions, IAttribute, isCsvFormatOptions, isFormatOptions} from "./FormatOptions";
import {Format} from "./Formats";
import {Formatters} from "./Formatters";

export const getOutputLanguageName = (code = "en") => {
    const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
    
    return languageNames.of(code);
};

export const getOutputLanguagePrompt = (code = "en") =>
    `You can write output only in ${getOutputLanguageName(code)} language.`;

export const getOutputLanguageMessage = (code = "en"): ChatCompletionRequestMessage => ({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: getOutputLanguagePrompt(code),
});

export const getFormattedMessage = (item: ChatCompletionRequestMessage, format: Format, options?: FormatOptions) =>
    $_.assign({}, item, { content: `${item.content} ${getFormattedText(format, options)}`});

export const getFormattedText = (format: Format, options?: FormatOptions) => {
    let result = Formatters[format];

    if (!options) return result;
    
    if (isCsvFormatOptions(options)) {
        const { attributes, columnSeparator = ",", rowSeparator = "\n" } = options;
        
        result += ` ${getAttributesText(attributes)}`;
        result += ` Use ${columnSeparator} as column separator.`;
        result += ` Use ${rowSeparator} as row separator.`;

        return result;
    }

    if (isFormatOptions(options)) {
        result += ` ${getAttributesText(options.attributes)}`;

        return result;
    }

    return result;
};

export const getAttributesText = (attributes: IAttribute[]) => {
    const attributeStrings = $_.map(attributes, (item) => {
        let type = "";
        let minLength = "";
        let maxLength = "";
        let custom = "";

        if (item.type) type += item.type;
        if (item.minLength) minLength += `min length ${item.minLength} characters`;
        if (item.maxLength) maxLength += `max length ${item.maxLength} characters`;
        if (item.custom) custom += item.custom;

        const length = $_.join($_.compact([minLength, maxLength]), " and ");
        const details = [type, length, custom];
        const hasDetails = $_.some(details, (item) => !$_.isEmpty(item));
        
        return `${item.name}${hasDetails ? ` (${$_.join($_.compact(details), ", ")})` : ""}`;
    });

    return `I want the following to be included in it: ${$_.join(attributeStrings, ", ")}.`;
};