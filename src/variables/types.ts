import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export enum AccountTypeEnum {
  Credentials,
  InitDataRaw
}

export interface AuthRequest extends Request {
  token: TokenPayload;
}

export interface TokenPayload extends JwtPayload {
  _id: string;
  accountType: AccountTypeEnum;
}

export interface WithIdDoc {
  _id: string
}