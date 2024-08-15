import { Router } from "express";
import { verifyTokenOptional, verifyTokenRequired } from "../middleware/verifyToken.js";
import { createPost, deletePost, editPost, fetchPost, fetchPosts } from "../controllers/postsController.js";

const router = Router();

router.get("/fetch-single/:postId", verifyTokenOptional, fetchPost);
router.post("/fetch-multiple", verifyTokenOptional, fetchPosts);
router.post("/create", verifyTokenRequired, createPost);
router.post("/edit", verifyTokenRequired, editPost);
router.post("/delete", verifyTokenRequired, deletePost);

export default router;
