import { MongoClient } from "mongodb";
import { MONGODB_NAME, MONGODB_URL } from "../const";

const localUrl = MONGODB_URL || "";

export const client = new MongoClient(localUrl);
export const db = client.db(MONGODB_NAME);