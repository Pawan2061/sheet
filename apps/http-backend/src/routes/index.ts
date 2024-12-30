import express, { Router } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/prisma/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { JwtPayload } from "../interface/types";
import { authMiddleware, createToken } from "../middleware";
import { login, signup } from "../controllers/users";
import { createSheet, getSheets, getSheetsBySlug } from "../controllers/sheet";

export const approuter: Router = express.Router();
approuter.post("/signup", signup);

approuter.post("/signin", login);

approuter.post(`/sheet/:slug`, authMiddleware, createSheet);

approuter.put("/sheet", (req, res) => {});

approuter.get("/sheets/:slug", authMiddleware, getSheetsBySlug);

approuter.get("/sheets", authMiddleware, getSheets);
