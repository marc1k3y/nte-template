import { CorsOptions } from "cors";

const whitelist = ["http://localhost:5173", "http://192.168.153.139:5173", "http://162.33.179.56"];
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