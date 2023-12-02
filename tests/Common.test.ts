import $_ from "lodash";
import {OpenAI} from "openai";

import Formatter from "../src/index";

const openAi = new OpenAI({
    apiKey: "test-openai-api-key",
    organization: "test-openai-organization",
});

describe("Common", () => {
    it("should create Formatter instance", () => {
        const formatter = new Formatter(openAi);
        expect(formatter).toBeDefined();
    });
});
