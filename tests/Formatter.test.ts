import {OpenAI} from "openai";

import {Formatter, UpdateCallbackParams} from "../src/Formatter";

const openAi = new OpenAI({
    apiKey: "test-openai-api-key",
    organization: "test-openai-organization",
});

jest.useRealTimers();
jest.setTimeout(100000);

describe("Formatter", () => {
    it("should resolve data sync", async () => {
        const formatter = new Formatter(openAi);
        const result = await formatter.createChatCompletion(
            {
                messages: [
                    {
                        role: "user",
                        content: "Suggest 1 place to visit in Warsaw",
                    },
                ],
                model: "gpt-3.5-turbo-16k",
                stream: false,
            },
            {},
            {
                format: "markdown",
                language: "pl",
            },
        );
        console.log(result.content);
        expect(result.content).toBe("Palace of Cukture & Science");
    });

    it("should resolve data async", async () => {
        const formatter = new Formatter(openAi);
        try {
            const chunks: string[] = [];
            const result = await formatter.createChatCompletionStream(
                {
                    messages: [
                        {
                            role: "user",
                            content: "Suggest 1 place to visit in Warsaw. Do not write explanations.",
                        },
                    ],
                    model: "gpt-3.5-turbo-16k",
                    stream: true,
                },
                {},
                {
                    format: "markdown",
                    language: "pl",
                },
                (params: Partial<UpdateCallbackParams>) => {
                    chunks.push(params.data);
                    expect(params.data).not.toBeNull();
                },
            );
            expect(result.content).not.toBeNull();
            expect(chunks).not.toBeNull();
            expect(chunks.length).toBe(3);
            expect(chunks.join("")).toEqual(result.content);
        } catch (e) {
            expect(e).toMatch("error");
        }
    });

    it("should resolve json data async", async () => {
        const formatter = new Formatter(openAi);
        try {
            const chunks: string[] = [];
            const result = await formatter.createChatCompletionStream(
                {
                    messages: [
                        {
                            role: "user",
                            content: "Suggest 2 places to visit in Warsaw. Do not write explanations.",
                        },
                    ],
                    model: "gpt-3.5-turbo-16k",
                    stream: true,
                },
                {},
                {
                    format: "json",
                    language: "pl",
                },
                (params: Partial<UpdateCallbackParams>) => {
                    chunks.push(params.data);
                    expect(params.data).not.toBeNull();
                },
            );
            console.log(result.content);
            expect(result.content).not.toBeNull();
            // expect(result.content).toBe(1);
            expect(result.content[0].name).toBe("Palace of Culture & Science");
        } catch (e) {
            expect(e).toMatch("error");
        }
    });

    it("should abort data async", async () => {
        const formatter = new Formatter(openAi);
        const controller = new AbortController();
        try {
            const chunks: string[] = [];
            const result = await formatter.createChatCompletionStream(
                {
                    messages: [
                        {
                            role: "user",
                            content: "Suggest 1 place to visit in Warsaw. Do not write explanations.",
                        },
                    ],
                    model: "gpt-3.5-turbo-16k",
                    stream: true,
                },
                {},
                {
                    format: "markdown",
                    language: "pl",
                },
                (params: Partial<UpdateCallbackParams>) => {
                    expect(params.data).not.toBeNull();
                    chunks.push(params.data);
                    controller.abort("cancel");
                },
                undefined,
                undefined,
                controller.signal,
            );
            expect(chunks.length).toBe(1);
            expect(controller.signal.aborted).toBe(true);
            expect(controller.signal.reason).toBe("cancel");
        } catch (e) {
            expect(e).toMatch("error");
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
