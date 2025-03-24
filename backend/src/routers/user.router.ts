import { Router } from "express";
import { getUserData, login, register } from '../controllers/user.controller';
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserData);

export default router;