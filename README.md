<figure>
    <img src="/assets/img/logo.png" alt="Albuquerque, New Mexico">
    <figcaption align="center">
		<em>Sanitize ChatGPT output and format it the way you want!</em>
	</figcaption>
</figure>


**FormatGPT** is a robust library designed to sanitize output provided by ChatGPT.
It provides a consistent and well defined method for retrieving the data from ChatGPT by acting as a middle man between your code and ChatGPT API.
It supports various formats such as:
- text
- json
- json-list
- csv
- html
- markdown
- arrays
- tables
- xml
- yaml

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

Here's a quick example to get you started:

```typescript
import formatGPT from "format-gpt";

formatGpt.format({
	format: "json",
	options: {
		attributes: [
			{ name: "name", type: "string" },
			{ name: "description", type: "string", maxLength: 200 },
			{ name: "released", type: "date" },
			{ name: "price", type: "decimal" }
		]
	},
	language: "en"
});
```

## API Reference
The default export is `formatChatGptPrompt`.


#### formatChatGptPrompt

```typescript
formatChatGptPrompt({
  prompt: string,
  format: Format,
  options?: FormatOptions,
  language?: string
}): string;
```
##### props

* `prompt (string)` - content of the prompt for chat-gpt
* `format (Format)` - format in which to return output from chat-gpt
* `options (FormatOptions)`
	* `attributes: (IAttribute[])`- array with attribute definitions
	* `columnSeparator (string)`- column separator (for CSV format, default: ",")
	* `rowSeparator (string)`- row separator (for CSV format. default: \n)
* `language (string)` - language code (example: en, pl)

#### formatChatGptMessages

```typescript
formatChatGptMessages({
  messages: ChatCompletionRequestMessage[],
  format: Format,
  options?: FormatOptions,
  language?: string
}): ChatCompletionRequestMessage[];
```

##### props

* `messages (ChatCompletionRequestMessage[])` - messages sent to chat-gpt api
* `format (Format)` - format in which to return output from chat-gpt
* `options (FormatOptions)`
	* `attributes: (IAttribute[])`- array with attribute definitions
	* `columnSeparator (string)`- column separator (for CSV format, default: ",")
	* `rowSeparator (string)`- row separator (for CSV format. default: \n)
* `language (string)` - language code (example: en, pl)

#### formatChatGptRequest

```typescript
formatChatGptRequest({
  request: CreateChatCompletionRequest,
  format: Format,
  options?: FormatOptions,
  language?: string
}): CreateChatCompletionRequest;
```

##### props

* `request (CreateChatCompletionRequest)` - request config for chat-gpt api
* `format (Format)` - format in which to return output from chat-gpt
* `options (FormatOptions)`
	* `attributes: (IAttribute[])`- array with attribute definitions
	* `columnSeparator (string)`- column separator (for CSV format, default: ",")
	* `rowSeparator (string)`- row separator (for CSV format. default: \n)
* `language (string)` - language code (example: en, pl)
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