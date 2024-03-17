import { Router } from "express";
import { authMiddleware } from "./middleware/auth";
import { AuthController } from "./controller/auth";

const router = Router();

// auth
const auth = new AuthController();
router.get("/auth/check", authMiddleware, auth.check);
router.post("/auth/create", auth.create);
router.post("/auth/login", auth.login);

export default router;