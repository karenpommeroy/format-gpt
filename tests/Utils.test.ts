import $_ from "lodash";
import { ChatCompletionRequestMessage } from "openai";

import { Format, FormatExpressions, IAttribute, ICsvFormatOptions, IFormatOptions } from "../src/Common";
import {
    getAttributesText,
    getFormattedMessage,
    getFormattedText,
    getOutputLanguageMessage,
    getOutputLanguageName,
    getOutputLanguagePrompt,
    isAttributeArray,
    isCsvFormatOptions,
    isFormatOptions,
} from "../src/Utils";

const formats: Format[] = [
    "array",
    "csv",
    "html",
    "html-table",
    "json",
    "json-list",
    "markdown",
    "markdown-table",
    "text",
    "xml",
    "yaml",
];
const languages = [
    { code: "en", name: "English" },
    { code: "pl", name: "Polish" },
    { code: "de", name: "German" },
];
const messageMock: ChatCompletionRequestMessage = { role: "user", content: "This is a user message test placeholder." };
const attributesMock: IAttribute[] = [
    { name: "name", type: "string" },
    { name: "order", type: "integer" },
    { name: "value", type: "decimal" },
    { name: "enabled", type: "boolean" },
    { name: "date", type: "date" },
    { name: "comments", type: "string", maxLength: 50 },
    { name: "description", type: "string", minLength: 50, maxLength: 100 },
    { name: "info", type: "string", custom: "custom placeholder" },
    { name: "summary", type: "string", minLength: 25, maxLength: 50, custom: "custom placeholder" },
];
const optionsMock: ICsvFormatOptions = {
    attributes: attributesMock,
    columnSeparator: ";",
    rowSeparator: "\n",
};
const formatOptions: IFormatOptions = {
    attributes: [{ name: "name", type: "string" }],
};
const csvFormatOptions: ICsvFormatOptions = {
    attributes: [{ name: "name", type: "string" }],
    columnSeparator: ";",
    rowSeparator: "\n",
};

const csvMock = [
    ["name", "model", "year", "price"],
    ["one", "test", 2012, "$2000.99"],
    ["two", "dev", 2022, "$199.99"],
    ["three", "backup", 1998, "$0.99"],
    ["four", "unique", 2023, "$12000.00"],
];

describe("Utils", () => {
    it("should resolve language name from code", () => {
        $_.forEach(languages, (item) => {
            expect(getOutputLanguageName(item.code)).toBe(item.name);
        });
    });

    it("should resolve language prompt from code", () => {
        $_.forEach(languages, (item) => {
            expect(getOutputLanguagePrompt(item.code)).toBe(`You should write output in ${item.name} language only.`);
        });
    });

    it("should resolve language message from code", () => {
        $_.forEach(languages, (item) => {
            const expected = { role: "system", content: `You should write output in ${item.name} language only.` };
            expect(getOutputLanguageMessage(item.code)).toEqual(expect.objectContaining(expected));
        });
    });

    it("should resolve formatted message", () => {
        const result = getFormattedMessage(messageMock, "csv", optionsMock);
        const msg = messageMock.content;
        const format = `You should write output only in ${FormatExpressions.csv} format.`;
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
        const attrTxt = "You should include the following in it:";
        const colSeparator = "You should use ; as column separator.";
        const rowSeparator = "You should use \n as row separator.";
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

            expect(result).toContain(FormatExpressions[format]);
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

    it("should convert CSV to array", () => {
        // const csv =  csvMock.map(
        //     row => row.map(item => (typeof item === "string" ? `"${item}"` : item)).join(";")).join("\n");
        // const csvArray = csvToArray(csv, undefined, ";");
        // console.log(JSON.stringify(csv));
        // expect(csvArray.header).toHaveLength(4);
        // expect(csvArray.rows).toHaveLength(3);
    });

    it("should recognize FormatOptions", () => {
        expect(isFormatOptions(formatOptions)).toBe(true);
        expect(isCsvFormatOptions(formatOptions)).toBe(false);
    });

    it("should recognize CsvFormatOptions", () => {
        expect(isFormatOptions(csvFormatOptions)).toBe(true);
        expect(isCsvFormatOptions(csvFormatOptions)).toBe(true);
    });

    it("should recognize AttributeArray", () => {
        expect(isAttributeArray(attributesMock)).toBe(true);
    });
});
