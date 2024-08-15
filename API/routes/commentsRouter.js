import { Router } from "express";
import { createComment, deleteComment, editComment, fetchComments } from "../controllers/commentsController.js";
import { verifyTokenOptional, verifyTokenRequired } from "../middleware/verifyToken.js";


const router = Router();

router.post("/fetch", verifyTokenOptional, fetchComments);
router.post("/create", verifyTokenRequired, createComment);
router.post("/edit", verifyTokenRequired, editComment);
router.post("/delete", verifyTokenRequired, deleteComment);

export default router;