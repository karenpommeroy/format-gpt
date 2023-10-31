import $_ from "lodash";
import {ChatCompletionCreateParams, ChatCompletionMessage} from "openai/resources";

import {IOutputConfig} from "./Common";
import {getFormattedText, getOutputLanguagePrompt} from "./Utils";

export const formatGptRequest = (request: ChatCompletionCreateParams, output?: IOutputConfig) => {
    return $_.assign({}, request, {messages: formatGptMessages(request.messages, output)});
};

export const formatGptMessages = (messages: ChatCompletionMessage[], output: IOutputConfig = {}) => {
    const {format, options, language} = output;
    const prompts: Array<string> = [];
    const inMessages = [...messages];
    const currentSystemMessages = $_.remove(inMessages, ["role", "system"]);

    prompts.push(...$_.compact($_.map(currentSystemMessages, "content")));
    prompts.push(getFormattedText(format, options));

    if (language) {
        prompts.push(getOutputLanguagePrompt(language));
    }

    return [{role: "system", content: $_.join(prompts, " ")}, ...inMessages];
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
