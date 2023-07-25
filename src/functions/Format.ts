import $_ from "lodash";

import {
    ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum
} from "../common/ChatGpt";
import {
    IFormatChatGptMessagesParams, IFormatChatGptPromptParams, IFormatChatGptRequestParams
} from "../common/FormatParams";
import {
    getFormattedMessage, getFormattedText, getOutputLanguageMessage, getOutputLanguagePrompt
} from "../common/Utils";

export const formatChatGptRequest = (params: IFormatChatGptRequestParams) => {
    const { request, format, options, language} = params;
    
    return $_.assign(
        {},
        request,
        { messages: formatChatGptMessages({ messages: request.messages, format, options, language }) }
    );
};

export const formatChatGptMessages = (params: IFormatChatGptMessagesParams) => {
    const { messages, format, options, language} = params;
    const formattedMessages: Array<ChatCompletionRequestMessage> = [];
    
    if (language) {
        formattedMessages.push(getOutputLanguageMessage(language));
    }
    
    formattedMessages.push(...$_.map(messages, (item) =>
        item.role === ChatCompletionRequestMessageRoleEnum.User ? getFormattedMessage(item, format, options): item
    ));

    return formattedMessages;
};

export const formatChatGptPrompt = (params: IFormatChatGptPromptParams) => {
    const { prompt, format, options, language} = params;
    let formattedPrompt = "";

    if (language) {
        formattedPrompt = `${getOutputLanguagePrompt(language)} ${prompt}`;
    }

    return `${formattedPrompt} ${getFormattedText(format, options)}`;
};

export default formatChatGptPrompt;


