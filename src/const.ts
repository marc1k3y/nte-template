import { join } from "path";

require("dotenv").config({ path: join(__dirname, ".env") });

export const JWT_SECRET = process.env.JWT_SECRET_KEY;