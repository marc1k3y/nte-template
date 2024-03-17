import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  token: TokenPayload;
}

export interface TokenPayload extends JwtPayload {
  _id: string
  email: string
}

export interface WithIdDoc {
  _id: string
}