import { Request, Response } from "express";
import { createChain } from "../utils/chain";
export const createAnswer = async (req: Request, res: Response) => {
  try {
    console.log("iinside ai");

    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Topic is required" });
      return;
    }

    console.log(prompt, "prompt");

    const chain = createChain(prompt);

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    });

    const stream = await chain.stream({ prompt });

    for await (const chunk of stream) {
      res.write(chunk);
      console.log(`Sent chunk: ${chunk}`);
    }
    res.end();
  } catch (error) {
    console.error("Error during streaming:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
};
