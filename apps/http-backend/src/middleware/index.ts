import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];
    
    const decoded = jwt.verify(header as string, JWT_PASSWORD);

    if (decoded) {
        req.userId = (decoded as JwtPayload)?.userId;
        next();
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }

}