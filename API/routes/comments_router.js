import { Router } from "express";
import { createComment, deleteComment, editComment, fetchComments } from "../controllers/comments_controller.js";
import { verifyTokenOptional, verifyTokenRequired } from "../middleware/verify_token.js";


const router = Router();

router.post("/fetch", verifyTokenOptional, fetchComments);
router.post("/create", verifyTokenRequired, createComment);
router.post("/edit", verifyTokenRequired, editComment);
router.post("/delete", verifyTokenRequired, deleteComment);

export default router;