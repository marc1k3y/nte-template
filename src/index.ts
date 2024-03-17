import { join } from "path";
require("dotenv").config({ path: join(__dirname, ".env") });

import express, { Request, Response, json, urlencoded } from "express";
import cors from "cors";
// import router from "./router";
import { corsOptions } from "./middleware/cors";
import { client } from "./service/mongodb";
import { errorMiddleware } from "./middleware/error";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(urlencoded({ extended: false }));
app.use(json());
// app.use("/user", router);
app.use(errorMiddleware);

app.get("/", (_: Request, res: Response) => {
  return res.send("[+] server is up");
});

app.listen(PORT, () => {
  client.connect().then(() => console.log("[+] MONGODB CONNECTION"));
  console.log(`Port listening on ${PORT}`);
});