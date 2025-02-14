import { join } from "path";
require("dotenv").config({ path: join(__dirname, ".env") });

export const JWT_SECRET = process.env.JWT_SECRET_KEY;
export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
export const MONGODB_NAME = process.env.MONGODB_NAME;