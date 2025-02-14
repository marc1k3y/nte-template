import { MongoClient } from "mongodb";
import { MONGODB_NAME, MONGODB_URL } from "../variables/constants";

const localUrl = MONGODB_URL || "";

export const client = new MongoClient(localUrl);
const db = client.db(MONGODB_NAME);

export const userCollection = db.collection("users");