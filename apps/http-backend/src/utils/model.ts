import { ChatOpenAI } from "@langchain/openai";
import { OPENAI_API_KEY } from "../config";
export const model = new ChatOpenAI({
  model: "gpt-4",
  apiKey:
    "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",
});
