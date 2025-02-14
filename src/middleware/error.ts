import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`[-] ${req.originalUrl}`);
  // check if not error set unexpected error message
  const errBody = err.message.split(":");
  if (errBody.length !== 2) res.status(500).json({ message: err.message });
  const code = parseInt(errBody[0]);
  const message = errBody[1];
  res.status(code).json({ message });
  next();
}