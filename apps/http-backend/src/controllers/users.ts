import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/prisma/client";
import { JwtPayload } from "../interface/types";
import { createToken } from "../middleware";
export const signup = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.hash(password, 10, async (err, hashedPw) => {
    try {
      const user = await prismaClient.user.create({
        data: {
          username,
          password: hashedPw,
        },
      });
      res.json({
        user,
      });
    } catch (e) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });
};

export const login = async (req: any, res: Response): Promise<any> => {
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
};
