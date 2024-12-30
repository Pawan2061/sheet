import express, { Router } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/prisma/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

export const approuter: Router = express.Router();
approuter.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.hash(password, 10, async (err, hashedPw) => {
    try {
      await prismaClient.user.create({
        data: {
          username,
          password: hashedPw,
        },
      });
      res.json({
        message: "You have signed up",
      });
    } catch (e) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });
});

approuter.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await prismaClient.user.findFirst({
    where: {
      username: username,
    },
  });
  console.log(user);

  console.log(`user ${user?.username} is here`);

  if (!user) {
    res.status(403).json({
      message: "Incorrect creds",
    });
    return;
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },

      JWT_PASSWORD
    );
    res.json({
      token,
    });
    return;
  } else {
    res.status(403).json({
      message: "Cant log in",
    });
  }
});

approuter.post("/sheet", (req, res) => {});

approuter.put("/sheet", (req, res) => {});

approuter.get("/sheet", (req, res) => {});

approuter.get("/sheets", (req, res) => {});
