import { Router } from "express";
import { register } from "../controllers/auth_controller.js";
import { verifyToken } from "../middleware/verify_token.js";

const router = Router();

router.post("/register", verifyToken, register);

export default router;
