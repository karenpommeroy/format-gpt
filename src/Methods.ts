import $_ from "lodash";
import {ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, CreateChatCompletionRequest} from "openai";

import {IOutputConfig} from "./Common";
import {getFormattedText, getOutputLanguagePrompt} from "./Utils";

export const formatGptRequest = (request: CreateChatCompletionRequest, output?: IOutputConfig) => {
    return $_.assign({}, request, {messages: formatGptMessages(request.messages, output)});
};

export const formatGptMessages = (messages: ChatCompletionRequestMessage[], output: IOutputConfig = {}) => {
    const {format, options, language} = output;
    const prompts: Array<string> = [];
    const inMessages = [...messages];
    const currentSystemMessages = $_.remove(inMessages, ["role", ChatCompletionRequestMessageRoleEnum.System]);

    prompts.concat($_.compact($_.map(currentSystemMessages, "content")));
    prompts.push(getFormattedText(format, options));

    if (language) {
        prompts.push(getOutputLanguagePrompt(language));
    }

    return [{role: ChatCompletionRequestMessageRoleEnum.System, content: $_.join(prompts, " ")}, ...inMessages];
};

export const formatGptPrompt = (prompt: string, output: IOutputConfig = {}) => {
    const {format, options, language} = output;
    const parts = [];

    if (language) {
        parts.push(getOutputLanguagePrompt(language));
    }

    parts.push(getFormattedText(format, options));
    parts.push(prompt);

    return $_.join(parts, " ");
};
