import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

export const createToken = async (payload: any) => {
  const token = jwt.sign(payload, JWT_PASSWORD as string, {
    expiresIn: "2d",
  });
  console.log(token);

  return token;
};

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token: any = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
  }
  console.log(JWT_PASSWORD, "passwords");

  jwt.verify(token, JWT_PASSWORD as string, (err: any, decodedToken: any) => {
    console.log(decodedToken, "token was here");

    if (err) {
      console.log(err);

      return res.json({ error: err.message });
    }
    req.user = decodedToken;
    next();
  });
};
