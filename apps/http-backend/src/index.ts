import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { approuter } from "./routes";
import { createAnswer } from "./controllers/lchain";
dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", approuter);
app.use("/ask", createAnswer);

app.listen(3001, () => {
  console.log(`working on port ${8080}`);
});
