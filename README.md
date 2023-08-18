<figure>
    <img src="/assets/img/logo.png" alt="format-gpt">
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

-   [Table of Contents](#table-of-contents)
-   [Installation](#installation)
-   [Usage](#usage)
-   [API Reference](#api-reference)
    -   [_formatGptPrompt_](#formatgptprompt)
    -   [_formatGptMessages_](#formatgptmessages)
    -   [_formatGptRequest_](#formatgptrequest)
    -   [_Format_](#format)
    -   [_IAttribute_](#iattribute)
-   [Building](#building)
-   [Tests](#tests)
-   [License](#license)

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
import {Configuration, OpenAIApi} from "openai";

// Create OpenAIApi instance
const configuration = new Configuration({
    organization: "YOUR_ORGANIZATION_ID",
    apiKey: "YOUR_API_KEY",
});
const openai = new OpenAIApi(configuration);

// Initialize GptFormatter providing OpenAIApi instance
const formatter = new GptFormatter(openai);

// Use provided FormatGPT wrapper methods instead of those from OpenAIApi.
// Below is an example using `createChatCompletion` method.
const result = await formatter.createChatCompletion(request, options, output);
```

Parameters `request` and `options` are the same ones as passed to `createChatCompletion` method from `openai` library.

Parameter `output` is where the magic happens.  
You define how you would like the output to be structured and under the hood **FormatGPT** transforms your requests and prompts to achieve desired result.

## API Reference

The default export is `formatChatGptPrompt`.

### _formatGptPrompt_

```typescript
formatGptPrompt(prompt: string, output: IOutputConfig): string;
```

-   `prompt (string)` - content of the prompt for chat-gpt
-   `output (IOutputConfig)`
    -   `format (Format | string)` - format of data retrieved from `chat-gpt` (described below)
    -   `attributes: (IAttribute[])`- array with attribute definitions
    -   `language (string)` - language code (determines language of retrieved data, i.e. `"en"`, `"de"`)
    -   `columnSeparator (string)`- column separator (for CSV format, default: `","`)
    -   `rowSeparator (string)`- row separator (for CSV format. default: `\n`)

### _formatGptMessages_

```typescript
formatGptMessages(messages: ChatCompletionRequestMessage[], output: IOutputConfig): ChatCompletionRequestMessage[];
```

-   `messages (ChatCompletionRequestMessage[])` - messages sent to chat-gpt api
-   `output (IOutputConfig)` - output configuration

### _formatGptRequest_

```typescript
formatGptRequest(request: CreateChatCompletionRequest, output: IOutputConfig): CreateChatCompletionRequest;
```

-   `request (CreateChatCompletionRequest)` - request config for chat-gpt api
-   `output (IOutputConfig)` - output configuration

### _Format_

```typescript
type Format = "string"; // You can use one of the predefined formats
```

Available predefined formats:

-   `text` - plain text string
-   `array` - javascript array (`["item1", "item2", "item3"]`)
-   `csv` - text in CSV format (configure column and line separator with `IOutputConfig`)
-   `html` - string containing html
-   `html-table` - string containing table in html format
-   `markdown` - string containing markdown
-   `markdown-table` - string containing table in markdown format
-   `json` - JSON object
-   `json-list` - list of JSON objects (e.g. `[{ a: "A", b: "B"}, { a: "A", b: "B"}, ...]`)
-   `xml` - string containing xml
-   `yaml` - string containing yaml

### _IAttribute_

```typescript
interface IAttribute {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "integer" | "decimal" | IAttribute[];
    minLength?: number;
    maxLength?: number;
    custom?: string;
}
```

-   `name` - display name of the attribute in output data
-   `type` - simple type or an array of attributes (`IAttribute[]`), also try experimenting with other types
-   `minLength` - minimum length of the attribute (applicable to text)
-   `maxLength` - maximum length of the attribute (applicable to text)
-   `custom` - additional attrribute description (e.g. `"uppercase"`, `"truncate to 2 decimal places"`)

<br />

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
