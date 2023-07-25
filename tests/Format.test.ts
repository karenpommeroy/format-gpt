import $_ from "lodash";

import {ChatCompletionRequestMessage, CreateChatCompletionRequest} from "../src/common/ChatGpt";
import {IFormatOptions} from "../src/common/FormatOptions";
import {Format} from "../src/common/Formats";
import {Formatters} from "../src/common/Formatters";
import {formatChatGptMessages, formatChatGptPrompt, formatChatGptRequest} from "../src/index";

const formats: Format[] = ["array", "csv", "html", "json", "json-list", "markdown", "table", "text", "xml", "yaml"];
const languages = [
    { code: "en", name: "English" },
    { code: "pl", name: "Polish" },
    { code: "de", name: "German" }
];
const optionsMock: IFormatOptions = {
    attributes: [
        { name: "name", type: "string" },
        { name: "order", type: "integer" },
        { name: "value", type: "decimal" },
        { name: "enabled", type: "boolean" },
        { name: "date", type: "date" },
        { name: "comments", type: "string", maxLength: 50 },
        { name: "description", type: "string", minLength: 50, maxLength: 100 },
        { name: "info", type: "string", custom: "custom placeholder"},
        { name: "summary", type: "string", minLength: 25, maxLength: 50, custom: "custom placeholder"},
    ]
};
const systemMessageMock = "This is a system message test placeholder.";
const userMessageMock = "This is a user message test placeholder.";
const messagesMock: Array<ChatCompletionRequestMessage> = [
    { role: "system", content: systemMessageMock },
    { role: "user", content: userMessageMock },
];
const requestMock: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: messagesMock,
    temperature: 0.5,
    n: 1,
};

describe("Formatting ChatGPT Prompts", () => {
    it("should apply formats correctly", () => {
        $_.forEach(formats, (item) => {
            expect(formatChatGptPrompt({ prompt: userMessageMock, format: item })).toContain(Formatters[item]);
        });
    });

    it("should apply language correctly", () => {
        $_.forEach(languages, (item) => {
            expect(formatChatGptPrompt({ prompt: userMessageMock, format: "json", language: item.code }))
                .toContain(`You can write output only in ${item.name} language.`);
        });
    });

    it("should apply options correctly", () => {
        const result = formatChatGptPrompt({ prompt: userMessageMock, format: "json", options: optionsMock });
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
            const result = formatChatGptMessages({ messages: messagesMock, format: item });
            const userMessages = $_.map($_.filter(result, ["role", "user"]), "content");
            const expected = [expect.stringContaining(Formatters[item])];
            
            expect(result).toHaveLength(messagesMock.length);
            expect(userMessages).toEqual(expect.arrayContaining(expected));
        });
    });

    it("should apply language correctly", () => {
        $_.forEach(languages, (item) => {
            const result = formatChatGptMessages({ messages: messagesMock, format: "json", language: item.code });
            const systemMessages = $_.map($_.filter(result, ["role", "system"]), "content");
            const expected = [expect.stringContaining(`You can write output only in ${item.name} language.`)];

            expect(result).toHaveLength(messagesMock.length + 1);
            expect(systemMessages).toEqual(expect.arrayContaining(expected));
        });
    });

    it("should apply options correctly", () => {
        const result = formatChatGptMessages({ messages: messagesMock, format: "json", options: optionsMock });
        const userMessages = $_.map($_.filter(result, ["role", "user"]), "content");
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
            expect(userMessages).toEqual(expect.arrayContaining([expect.stringContaining(item)]))
        );
    });
});

describe("Formatting ChatGPT Requests", () => {
    it("should apply formats correctly", () => {
        $_.forEach(formats, (item) => {
            const result = formatChatGptRequest({ request: requestMock, format: item });
            const userMessages = $_.map($_.filter(result.messages, ["role", "user"]), "content");
            const expected = [expect.stringContaining(Formatters[item])];

            expect(result).toEqual(expect.objectContaining($_.omit(requestMock, "messages")));
            expect(result.messages).toHaveLength(requestMock.messages.length);
            expect(userMessages).toEqual(expect.arrayContaining(expected));
        });
    });

    it("should apply language correctly", () => {
        $_.forEach(languages, (item) => {
            const result = formatChatGptRequest({ request: requestMock, format: "json", language: item.code });
            const systemMessages = $_.map($_.filter(result.messages, ["role", "system"]), "content");
            const expected = [expect.stringContaining(`You can write output only in ${item.name} language.`)];

            expect(result).toEqual(expect.objectContaining($_.omit(requestMock, "messages")));
            expect(result.messages).toHaveLength(requestMock.messages.length + 1);
            expect(systemMessages).toEqual(expect.arrayContaining(expected));
        });
    });

    it("should apply options correctly", () => {
        const result = formatChatGptRequest({ request: requestMock, format: "json", options: optionsMock });
        const userMessages = $_.map($_.filter(result.messages, ["role", "user"]), "content");
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
            expect(userMessages).toEqual(expect.arrayContaining([expect.stringContaining(item)]))
        );
    });
});