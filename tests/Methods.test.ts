import $_ from "lodash";
import {ChatCompletionCreateParams, ChatCompletionMessageParam} from "openai/resources";

import {Format, FormatExpressions, IFormatOptions} from "../src/Common";
import {formatGptMessages, formatGptPrompt, formatGptRequest} from "../src/Methods";

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
    {code: "en", name: "English"},
    {code: "pl", name: "Polish"},
    {code: "de", name: "German"},
];
const optionsMock: IFormatOptions = {
    attributes: [
        {name: "name", type: "string"},
        {name: "order", type: "integer"},
        {name: "value", type: "decimal"},
        {name: "enabled", type: "boolean"},
        {name: "date", type: "date"},
        {name: "comments", type: "string", maxLength: 50},
        {name: "description", type: "string", minLength: 50, maxLength: 100},
        {name: "info", type: "string", custom: "custom placeholder"},
        {name: "summary", type: "string", minLength: 25, maxLength: 50, custom: "custom placeholder"},
    ],
};
const systemMessageMock = "This is a system message test placeholder.";
const userMessageMock = "This is a user message test placeholder.";
const messagesMock: Array<ChatCompletionMessageParam> = [
    {role: "system", content: systemMessageMock},
    {role: "user", content: userMessageMock},
];
const requestMock: ChatCompletionCreateParams = {
    model: "gpt-3.5-turbo",
    messages: messagesMock,
    temperature: 0.5,
    n: 1,
};

describe("Formatting ChatGPT Prompts", () => {
    it("should apply formats correctly", () => {
        $_.forEach(formats, (item) => {
            expect(formatGptPrompt(userMessageMock, {format: item})).toContain(FormatExpressions[item]);
        });
    });

    it("should apply language correctly", () => {
        $_.forEach(languages, (item) => {
            expect(formatGptPrompt(userMessageMock, {format: "json", language: item.code})).toContain(
                `You should write output in ${item.name} language only.`,
            );
        });
    });

    it("should apply options correctly", () => {
        const result = formatGptPrompt(userMessageMock, {format: "json", options: optionsMock});
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

describe("Formatting ChatGPT Messages", () => {
    it("should apply formats correctly", () => {
        $_.forEach(formats, (item) => {
            const result = formatGptMessages(messagesMock, {format: item});
            const systemMessages = $_.map($_.filter(result, ["role", "system"]), "content");
            const expected = [expect.stringContaining(FormatExpressions[item])];

            expect(result).toHaveLength(messagesMock.length);
            expect(systemMessages).toEqual(expect.arrayContaining(expected));
        });
    });

    it("should apply language correctly", () => {
        $_.forEach(languages, (item) => {
            const result = formatGptMessages(messagesMock, {format: "json", language: item.code});
            const systemMessages = $_.map($_.filter(result, ["role", "system"]), "content");
            const expected = [expect.stringContaining(`You should write output in ${item.name} language only.`)];

            expect(result).toHaveLength(messagesMock.length);
            expect(systemMessages).toEqual(expect.arrayContaining(expected));
        });
    });

    it("should apply options correctly", () => {
        const result = formatGptMessages(messagesMock, {format: "json", options: optionsMock});
        const systemMessages = $_.map($_.filter(result, ["role", "system"]), "content");
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

        $_.forEach(expected, (item) =>
            expect(systemMessages).toEqual(expect.arrayContaining([expect.stringContaining(item)])),
        );
    });
});

describe("Formatting ChatGPT Requests", () => {
    it("should apply formats correctly", () => {
        $_.forEach(formats, (item) => {
            const result = formatGptRequest(requestMock, {format: item});
            const systemMessages = $_.map($_.filter(result.messages, ["role", "system"]), "content");
            const expected = [expect.stringContaining(FormatExpressions[item])];

            expect(result).toEqual(expect.objectContaining($_.omit(requestMock, "messages")));
            expect(result.messages).toHaveLength(requestMock.messages.length);
            expect(systemMessages).toEqual(expect.arrayContaining(expected));
        });
    });

    it("should apply language correctly", () => {
        $_.forEach(languages, (item) => {
            const result = formatGptRequest(requestMock, {format: "json", language: item.code});
            const systemMessages = $_.map($_.filter(result.messages, ["role", "system"]), "content");
            const expected = [expect.stringContaining(`You should write output in ${item.name} language only.`)];

            expect(result).toEqual(expect.objectContaining($_.omit(requestMock, "messages")));
            expect(result.messages).toHaveLength(requestMock.messages.length);
            expect(systemMessages).toEqual(expect.arrayContaining(expected));
        });
    });

    it("should apply options correctly", () => {
        const result = formatGptRequest(requestMock, {format: "json", options: optionsMock});
        const systemMessages = $_.map($_.filter(result.messages, ["role", "system"]), "content");
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

        $_.forEach(expected, (item) =>
            expect(systemMessages).toEqual(expect.arrayContaining([expect.stringContaining(item)])),
        );
    });
});
