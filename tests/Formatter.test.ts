import {OpenAI} from "openai";

import {Formatter, UpdateCallbackParams} from "../src/Formatter";

jest.mock("openai", () => {
    return {
        OpenAI: function () {
            return {
                chat: {
                    completions: {
                        create: async () => ({
                            choices: [
                                {
                                    message: {
                                        role: "assistant",
                                        content: "Palace of Cukture & Science",
                                    },
                                },
                            ],
                        }),
                    },
                },
            };
        },
    };
});

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

    it.skip("should resolve data async", async () => {
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
            expect(chunks.length).toBeGreaterThan(5);
            console.log(chunks);
            //expect(chunks.join("")).toEqual(result.content);
        } catch (e) {
            expect(e).toMatch("error");
        }
    });

    // afterEach(() => {
    //     jest.clearAllMocks();
    // });
});
