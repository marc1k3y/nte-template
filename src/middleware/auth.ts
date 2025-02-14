import { verify } from "jsonwebtoken";
import { RequestHandler } from "express";
import { AuthRequest, TokenPayload } from "../variables/types";
import { JWT_SECRET } from "../variables/constants";

export const authMiddleware: RequestHandler = (req, _res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (!JWT_SECRET) throw new Error("500:secret_key_not_found");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("401:token_not_found");

    const decoded = <TokenPayload>verify(token, JWT_SECRET);

    (req as AuthRequest).token = decoded;
    return next();
  } catch (e) {
    return next(e);
  }
}