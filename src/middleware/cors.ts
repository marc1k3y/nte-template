import { CorsOptions } from "cors";

const whitelist = ["http://localhost:5173"];
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin as string)) {
      callback(null, true);
    } else {
      console.log("origin:", origin, "not allowed");
      callback(new Error("Not allowed by CORS"));
    }
  }
};