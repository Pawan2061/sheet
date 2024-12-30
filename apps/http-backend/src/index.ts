import express from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/prisma/client";
import bcrypt from "bcrypt";
import { JWT_PASSWORD } from "./config";
import dotenv from "dotenv";
import { approuter } from "./routes";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1", approuter);

app.listen(8080, () => {
  console.log(`working on port ${8080}`);
});
