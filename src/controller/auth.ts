import { Request, Response, NextFunction } from "express";
import { compareSync, hashSync } from "bcrypt";
import { db } from "../service/mongodb";
import { CustomRequest, TokenPayload } from "../types";
import { sign } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { JWT_SECRET } from "../const";

const generateJwt = (args: TokenPayload) => {
  if (!JWT_SECRET) throw new Error("500:jwt secret not found");
  return sign(args, JWT_SECRET, { expiresIn: "12h" });
}

export class AuthController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new Error("404:email or password missed");
      const findedUser = await db.collection("user").findOne({ email });
      if (findedUser) throw new Error("400:email already existing");
      const hashPassword = hashSync(password, 4);
      const insertedUser = await db.collection("user").insertOne({ email, password: hashPassword });
      if (!insertedUser) throw new Error("500:when inserting user");
      const token = generateJwt({ _id: insertedUser.insertedId.toJSON(), email });
      if (!token) throw new Error("500:whem generating jwt");
      return res.status(200).json({ token });
    } catch (e) {
      return next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new Error("404:email or password missed");
      const findedUser = await db.collection("user").findOne({ email });
      if (!findedUser) throw new Error("404:user not found");
      const comparePassword = compareSync(password, findedUser.password);
      if (!comparePassword) throw new Error("400:bad password");
      const token = generateJwt({ _id: findedUser._id.toString(), email: findedUser.email });
      if (!token) throw new Error("500:whem generating jwt");
      return res.status(200).json({ token });
    } catch (e) {
      return next(e);
    }
  }

  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id, email } = (req as CustomRequest).token;
      const findedUser = await db.collection("user").findOne({ _id: new ObjectId(_id) });
      if (!findedUser) throw new Error("404:user not found");
      const token = generateJwt({ _id, email });
      if (!token) throw new Error("500:generate token fail");
      return res.status(200).json({ token });
    } catch (e) {
      return next(e);
    }
  }
}