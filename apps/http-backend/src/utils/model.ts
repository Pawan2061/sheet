import { ChatOpenAI } from "@langchain/openai";
import { OPENAI_API_KEY } from "../config";
export const model = new ChatOpenAI({
  model: "gpt-4",
  apiKey: OPENAI_API_KEY,
});
