<figure>
    <img src="/assets/img/logo.png" alt="Albuquerque, New Mexico">
    <figcaption align="center">
		<em>Sanitize ChatGPT output and format it the way you want!</em>
	</figcaption>
</figure>

**FormatGPT** is a robust library designed to sanitize output provided by ChatGPT.
It provides a consistent and well defined methods for retrieving the data from ChatGPT by acting as a middle man between your code and ChatGPT API.
It supports various formats such as:

-   text
-   json
-   json-list
-   csv
-   html
-   markdown
-   arrays
-   tables
-   xml
-   yaml

Additionally each output format can be easily customized to suit your needs.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Reference](#api-reference)
4. [Building](#building)
5. [Tests](#tests)
6. [License](#license)

## Installation

To install the library using `npm` run the command:

```bash
npm install format-gpt
```

To install the library using `yarn` run the command:

```bash
yarn add format-gpt
```

## Usage

Here is quick example on how to format prompts for `chat-gpt`:

```typescript
import {formatGptPrompt} from "format-gpt";

formatGpt.format(prompt, {
    format: "json-list",
    language: "en",
    options: {
        attributes: [
            {name: "name", type: "string"},
            {name: "description", type: "string", maxLength: 200},
            {name: "released", type: "date"},
            {name: "price", type: "decimal"},
        ],
    },
});
```

And another example on how communicate with `chat-gpt` through provided wrapper:

```typescript
import FormatGPT from "format-gpt";

// Initialize wrapper providing OpenAIApi instance
const gptFormatter = new GptFormatter(openai);

// Use provided FormatGPT wrapper methods instead of standard OpenAIApi ones'
// Below is an example using wrapper in place of `createChatCompletion` method.

const yourFormattedOutput = await this.gptFormatter.makeRequestToChatGpt(requestParams, requestOptions, output);
```

Parameters `requestParams` and `requestOptions` are the same ones as passed to `createChatCompletion` method.

Parameter `output` is where the magic happens. You to define how you would like the output to be structured and under the hood **FormatGPT** transforms your requests and prompts to achieve desired data format, etc.

## API Reference

The default export is `formatChatGptPrompt`.

#### formatGptPrompt

```typescript
formatGptPrompt(prompt: string, output: IOutputConfig): string;
```

##### props

-   `prompt (string)` - content of the prompt for chat-gpt
-   `output (IOutputConfig)`
    -   `format (dtring)` - format of data retrieved from `chat-gpt`
    -   `attributes: (IAttribute[])`- array with attribute definitions
    -   `language (string)` - language code (determines language of retrieved data)
    -   `columnSeparator (string)`- column separator (for CSV format, default: ",")
    -   `rowSeparator (string)`- row separator (for CSV format. default: \n)

#### formatGptMessages

```typescript
formatGptMessages(messages: ChatCompletionRequestMessage[], output: IOutputConfig): ChatCompletionRequestMessage[];
```

##### props

-   `messages (ChatCompletionRequestMessage[])` - messages sent to chat-gpt api
-   `output (IOutputConfig)` - output configuration

#### formatGptRequest

```typescript
formatGptRequest(request: CreateChatCompletionRequest, output: IOutputConfig): CreateChatCompletionRequest;
```

##### props

-   `request (CreateChatCompletionRequest)` - request config for chat-gpt api
-   `output (IOutputConfig)` - output configuration
    <br />

#### Format

```typescript
type Format = "array" | "csv" | "html" | "json" | "json-list" | "markdown" | "table" | "text" | "xml" | "yaml";
```

#### IAttribute

```typescript
interface IAttribute {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "integer" | "decimal" | Array<IAttribute>;
    minLength?: number;
    maxLength?: number;
    custom?: string;
}
```

For more information on `ChatCompletionRequestMessage` and `CreateChatCompletionRequest` please refer [OpenAI documentation](https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages).

## Building

To build **format-gpt** follow these steps:

1. Clone this repository
2. Install dependencies using `npm install` or `yarn install` command
3. If using `yarn` with Visual Studio Code also run `yarn dlx @yarnpkg/sdks vscode`
4. Run `npm build` or `yarn build` command

## Tests

To run the test suite, first install the dependencies, then execute tests.

Using `npm`:

```bash
npm install
npm test
```

Using `yarn`:

```bash
yarn install
yarn test
```

## License

This project is licensed under the [MIT License](LICENSE).
