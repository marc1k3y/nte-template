import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { CustomRequest, TokenPayload } from "../types";
import { JWT_SECRET } from "../const";

export const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (!JWT_SECRET) throw new Error("500:secret_key_not_found");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("401:token_not_found");

    const decoded = <TokenPayload>verify(token, JWT_SECRET);
    if (!decoded._id) throw new Error("500:jwt_is_broken");

    (req as CustomRequest).token = decoded;
    return next();
  } catch (e) {
    return next(e);
  }
}