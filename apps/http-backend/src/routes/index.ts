import express, { Router } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/prisma/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { JwtPayload } from "../interface/types";
import { authMiddleware, createToken } from "../middleware";

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

approuter.post("/signin", async (req, res): Promise<any> => {
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
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      password: user.password,
    };

    const token = await createToken(payload);
    console.log(token, "token is here");

    res.json({
      token,
    });
    return;
  } else {
    return res.status(403).json({
      message: "Cant log in",
    });
  }
});

approuter.post(
  `/sheet/:slug`,
  authMiddleware,

  async (req: any, res): Promise<any> => {
    try {
      const slug = req.params.slug;
      const { title, content } = req.body;

      console.log("first steip");

      if (!slug || !title) {
        console.log("inside");

        return res.status(404).json({
          message: "not sufficient data",
        });
      }
      console.log("second steip");

      const sheet = await prismaClient.sheet.create({
        data: {
          slug: slug,
          title: title,
          content: content,
          userId: req.user.id,
          lastUpdateId: 3,
        },
      });
      console.log("first done");

      if (!sheet) {
        return res.status(400).json({
          message: "sheet is not created",
        });
      }
      return res.status(200).json(sheet);
    } catch (error) {
      console.log(error);

      return res.status(403).json({
        message: "Cant log in",
      });
    }
  }
);

approuter.put("/sheet", (req, res) => {});

approuter.get(
  "/sheets/:slug",
  authMiddleware,
  async (req, res): Promise<any> => {
    try {
      const slug = req.params.slug;

      if (!slug) {
        return res.status(404).json({
          message: "slug is not present",
        });
      }
      const sheet = await prismaClient.sheet.findUnique({
        where: {
          slug: slug,
        },
      });
      if (!sheet) {
        return res.status(404).json({
          message: "sheet not found",
        });
      }
      return res.status(200).json({
        sheet,
      });
    } catch (error) {
      console.log(error);

      return res.status(403).json({
        message: "sheets not  found",
      });
    }
  }
);

approuter.get("/sheets", authMiddleware, async (req, res): Promise<any> => {
  try {
    const sheets = await prismaClient.sheet.findMany();
    if (!sheets) {
      return res.status(404).json({
        message: "sheets not found",
      });
    }
    return res.status(200).json({
      sheets,
    });
  } catch (error) {
    console.log(error);

    return res.status(403).json({
      message: "sheets not found",
    });
  }
});
