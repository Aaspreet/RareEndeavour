import { Router } from "express";
import { verifyTokenOptional, verifyTokenRequired } from "../middleware/verifyToken.js";
import { fetchTargetUser, fetchUser, updateQuote } from "../controllers/userController.js";

const router = Router();

router.get("/@me", verifyTokenRequired, fetchUser);
router.get("/:uid", fetchTargetUser);

router.post("/update-quote", verifyTokenRequired, updateQuote);

export default router;
