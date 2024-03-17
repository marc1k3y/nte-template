import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(`[-] ${req.originalUrl}`);
  // check if not error set unexpected error message
  const errBody = err.message.split(":");
  if (errBody.length !== 2) return res.status(500).json({ message: err.message });
  const code = parseInt(errBody[0]);
  const message = errBody[1];
  res.status(code).json({ message });
  next();
}