import { Router } from "express";
import { register } from "../controllers/authController.js";
import { verifyTokenRequired } from "../middleware/verifyToken.js";

const router = Router();

router.post("/register", verifyTokenRequired, register);

export default router;
