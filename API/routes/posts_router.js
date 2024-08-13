import { Router } from "express";
import { verifyTokenOptional, verifyTokenRequired } from "../middleware/verify_token.js";
import { createPost, deletePost, editPost, fetchPost, fetchPosts } from "../controllers/posts_controller.js";

const router = Router();

router.post("/fetch_multiple", verifyTokenOptional, fetchPosts);
router.get("/fetch_single/:post_id", verifyTokenOptional, fetchPost);
router.post("/create", verifyTokenRequired, createPost);
router.post("/edit", verifyTokenRequired, editPost);
router.post("/delete", verifyTokenRequired, deletePost);

export default router;
