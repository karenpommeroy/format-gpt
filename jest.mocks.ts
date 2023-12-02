import {ChatCompletionChunk, ChatCompletionCreateParams} from "openai/resources";
import {Stream} from "openai/streaming";

jest.mock("openai", () => {
    return {
        OpenAI: function () {
            return {
                chat: {
                    completions: {
                        create: async (params: ChatCompletionCreateParams) => {
                            if (params.stream) {
                                return new Stream<ChatCompletionChunk>(
                                    () =>
                                        (async function* () {
                                            yield {
                                                id: "test-id",
                                                created: Date.now(),
                                                model: "",
                                                object: "chat.completion.chunk",
                                                choices: [
                                                    {
                                                        finish_reason: null,
                                                        index: 0,
                                                        delta: {
                                                            role: "assistant",
                                                            content: '[{ "name": "Palace of',
                                                        },
                                                    },
                                                ],
                                            };
                                            yield {
                                                id: "test-id",
                                                created: Date.now(),
                                                model: "",
                                                object: "chat.completion.chunk",
                                                choices: [
                                                    {
                                                        finish_reason: null,
                                                        index: 1,
                                                        delta: {
                                                            role: "assistant",
                                                            content: " Culture &",
                                                        },
                                                    },
                                                ],
                                            };
                                            yield {
                                                id: "test-id",
                                                created: Date.now(),
                                                model: "",
                                                object: "chat.completion.chunk",
                                                choices: [
                                                    {
                                                        finish_reason: "stop",
                                                        index: 2,
                                                        delta: {
                                                            role: "assistant",
                                                            content: ' Science"},\n]',
                                                        },
                                                    },
                                                ],
                                            };
                                        })(),
                                    new AbortController(),
                                );
                            } else {
                                return {
                                    choices: [
                                        {
                                            message: {
                                                role: "assistant",
                                                content: "Palace of Cukture & Science",
                                            },
                                        },
                                    ],
                                };
                            }
                        },
                    },
                },
            };
        },
    };
});
