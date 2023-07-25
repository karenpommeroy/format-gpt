import $_ from "lodash";

import {ChatCompletionRequestMessage} from "../src/common/ChatGpt";
import {IAttribute, ICsvFormatOptions} from "../src/common/FormatOptions";
import {Format} from "../src/common/Formats";
import {Formatters} from "../src/common/Formatters";
import {
    getAttributesText, getFormattedMessage, getFormattedText, getOutputLanguageMessage,
    getOutputLanguageName, getOutputLanguagePrompt
} from "../src/common/Utils";

const formats: Format[] = ["array", "csv", "html", "json", "json-list", "markdown", "table", "text", "xml", "yaml"];
const languages = [
    { code: "en", name: "English" },
    { code: "pl", name: "Polish" },
    { code: "de", name: "German" }
];
const messageMock: ChatCompletionRequestMessage = { role: "user", content: "This is a user message test placeholder."};
const attributesMock: IAttribute[] = [
    { name: "name", type: "string" },
    { name: "order", type: "integer" },
    { name: "value", type: "decimal" },
    { name: "enabled", type: "boolean" },
    { name: "date", type: "date" },
    { name: "comments", type: "string", maxLength: 50 },
    { name: "description", type: "string", minLength: 50, maxLength: 100 },
    { name: "info", type: "string", custom: "custom placeholder"},
    { name: "summary", type: "string", minLength: 25, maxLength: 50, custom: "custom placeholder"},
];
const optionsMock: ICsvFormatOptions = {
    attributes: attributesMock,
    columnSeparator: ";",
    rowSeparator: "\n"
};

describe("Utils", () => {
    it("should resolve language name from code", () => {
        $_.forEach(languages, (item) => {
            expect(getOutputLanguageName(item.code)).toBe(item.name);
        });
    });

    it("should resolve language prompt from code", () => {
        $_.forEach(languages, (item) => {
            expect(getOutputLanguagePrompt(item.code)).toBe(`You can write output only in ${item.name} language.`);
        });
    });

    it("should resolve language message from code", () => {
        $_.forEach(languages, (item) => {
            const expected = { role: "system", content: `You can write output only in ${item.name} language.` };
            expect(getOutputLanguageMessage(item.code)).toEqual(expect.objectContaining(expected));
        });
    });

    it("should resolve formatted message", () => {
        const result = getFormattedMessage(messageMock, "csv", optionsMock);
        const msg = messageMock.content;
        const format = Formatters.csv;
        const attr = [
            "name (string)",
            "order (integer)",
            "value (decimal)",
            "enabled (boolean)",
            "date (date)",
            "comments (string, max length 50 characters)",
            "description (string, min length 50 characters and max length 100 characters)",
            "info (string, custom placeholder)",
            "summary (string, min length 25 characters and max length 50 characters, custom placeholder)",
        ];
        const attrTxt = "I want the following to be included in it:";
        const colSeparator = "Use ; as column separator.";
        const rowSeparator = "Use \n as row separator.";
        const expectedContent = `${msg} ${format} ${attrTxt} ${$_.join(attr, ", ")}. ${colSeparator} ${rowSeparator}`;
        const expected = { role: messageMock.role, content: expectedContent };
        
        expect(result).toEqual(expect.objectContaining(expected));
    });

    it("should resolve formatted text", () => {
        $_.forEach(formats, (format) => {
            const result = getFormattedText(format, optionsMock);
            const expected = [
                "name (string)",
                "order (integer)",
                "value (decimal)",
                "enabled (boolean)",
                "date (date)",
                "comments (string, max length 50 characters)",
                "description (string, min length 50 characters and max length 100 characters)",
                "info (string, custom placeholder)",
                "summary (string, min length 25 characters and max length 50 characters, custom placeholder)",
            ];
            const expectedResult = $_.map(expected, (item) => $_.includes(result, item));

            expect(result).toContain(Formatters[format]);
            expect(expectedResult).toHaveLength(9);
            expect(expectedResult).not.toContain(false);
        });
        
        expect(true);
    });

    it("should resolve attribute text", () => {
        const result = getAttributesText(attributesMock);
        const expected = [
            "name (string)",
            "order (integer)",
            "value (decimal)",
            "enabled (boolean)",
            "date (date)",
            "comments (string, max length 50 characters)",
            "description (string, min length 50 characters and max length 100 characters)",
            "info (string, custom placeholder)",
            "summary (string, min length 25 characters and max length 50 characters, custom placeholder)",
        ];

        $_.forEach(expected, (item) => expect(result).toEqual(expect.stringContaining(item)));
    });
});