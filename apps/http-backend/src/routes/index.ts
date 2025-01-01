import express, { Router } from "express";
import { authMiddleware, createToken } from "../middleware";
import { login, signup } from "../controllers/users";
import { createSheet, getSheets, getSheetsBySlug } from "../controllers/sheet";
import { createAnswer } from "../controllers/lchain";

export const approuter: Router = express.Router();
approuter.post("/signup", signup);

approuter.post("/signin", login);

approuter.post(`/sheet/:slug`, authMiddleware, createSheet);

approuter.put("/sheet", (req, res) => {});

approuter.get("/sheets/:slug", authMiddleware, getSheetsBySlug);

approuter.get("/sheets", authMiddleware, getSheets);

// approuter.post("/ask", createAnswer);
