import { Router } from "express";
import { register } from "../controllers/auth_controller.js";
import { verifyTokenRequired } from "../middleware/verify_token.js";

const router = Router();

router.post("/register", verifyTokenRequired, register);

export default router;
