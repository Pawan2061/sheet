import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { model } from "./model";
export const createChain = (topic: string) => {
  const prompt = ChatPromptTemplate.fromTemplate(
    `Try to explain this ${topic} in short but dont need to exaggerate it just make it concise and try to do it in such a way that you are teaching this to a student`
  );
  return prompt.pipe(model).pipe(new StringOutputParser());
};
