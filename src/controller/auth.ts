import { sign } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { compareSync, hashSync } from "bcrypt";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { MasterController } from ".";
import { newUser } from "../variables/initial";
import { JWT_SECRET } from "../variables/constants";
import { userCollection } from "../service/mongodb";
import { AccountTypeEnum, AuthRequest, TokenPayload } from "../variables/types";

const generateJwt = (args: TokenPayload) => {
  if (!JWT_SECRET) throw new Error("500:jwt secret not found");
  return sign(args, JWT_SECRET, { expiresIn: "12h" });
}

export class AuthController extends MasterController {
  create: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw this.newError(404, "create", "req.body");
      const findedUser = await userCollection.findOne({ email });
      if (findedUser) throw this.newError(400, "create", "findedUser");
      const hashPassword = hashSync(password, 4);
      const insertedUser = await userCollection.insertOne({
        tgId: 0, email, password: hashPassword, accountType: AccountTypeEnum.Credentials, ...newUser
      });
      if (!insertedUser) throw this.newError(500, "create", "!insertedUser");
      const token = generateJwt({
        _id: insertedUser.insertedId.toJSON(), accountType: AccountTypeEnum.Credentials
      });
      if (!token) throw this.newError(500, "create", "generateJwt");
      res.status(200).json({ token, newUser });
    } catch (e) {
      return next(e);
    }
  }

  login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw this.newError(404, "login", "req.body");
      const findedUser = await userCollection.findOne({ email });
      if (!findedUser) throw this.newError(404, "login", "!findedUser");
      const comparePassword = compareSync(password, findedUser.password);
      if (!comparePassword) throw this.newError(401, "login", "!comparePassword");
      const token = generateJwt({ _id: findedUser._id.toString(), accountType: AccountTypeEnum.Credentials });
      if (!token) throw this.newError(500, "login", "generateJwt");
      res.status(200).json({ token, findedUser });
    } catch (e) {
      return next(e);
    }
  }

  check: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, accountType } = (req as AuthRequest).token;
      const findedUser = await userCollection.findOne({ _id: new ObjectId(_id) });
      if (!findedUser) throw this.newError(404, "check", "!findedUser");
      const token = generateJwt({ _id, accountType });
      if (!token) throw this.newError(500, "check", "generateJwt");
      res.status(200).json({ token, findedUser });
    } catch (e) {
      return next(e);
    }
  }

  // initDataRaw: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { initDataRaw } = req.body;
  //     try {
  //       validate(initDataRaw, BOT_TOKEN);
  //     } catch (e) {
  //       throw this.newError(401, "initDataRaw", "validate");
  //     }
  //     const { user } = parse(initDataRaw);
  //     if (!user) throw this.newError(404, "initDataRaw", "!user");
  //     let _id;
  //     let wallet: UserWalletIE;
  //     const findedUser = await userModel.findOne({ tgId: user.id });
  //     if (!findedUser) {
  //       const insertedUser = await userModel.insertOne({
  //         email: "", password: "", tgId: user.id, accountType: AccountTypeEnum.InitDataRaw, ...newUser
  //       });
  //       if (!insertedUser) throw this.newError(500, "initDataRaw", "!insertedUser");
  //       wallet = newUser.wallet;
  //       _id = insertedUser.insertedId.toString();
  //     } else {
  //       _id = findedUser._id.toString();
  //       wallet = findedUser.wallet;
  //     }
  //     const token = generateJwt({ _id, accountType: AccountTypeEnum.InitDataRaw });
  //     if (!token) throw this.newError(500, "check", "generateJwt");
  //     res.status(200).json({ token, wallet });
  //   } catch (e) {
  //     return next(e);
  //   }
  // }
}