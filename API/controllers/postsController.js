import errorHandler from "../middleware/errorHandler.js";
import { asyncQuery } from "../utils/asyncQuery.js";

export const fetchPosts = async (req, res, next) => {
  try {
    const quantity = req.query.quantity || 10;

    const { alreadyRenderedPostIds = [] } = req.body;
    console.log(alreadyRenderedPostIds + " logging from fetchPosts");

    const posts = await asyncQuery("SELECT * FROM POSTS WHERE post_id NOT IN (?) ORDER BY date_created DESC LIMIT ?", [
      alreadyRenderedPostIds,
      quantity,
    ]);

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching Posts"));
  }
};

export const fetchPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await asyncQuery("SELECT * FROM posts WHERE id = ?", [postId]);

    if (post.length === 0) return next(errorHandler(404, "Post not found"));

    return res.status(200).json(...post[0]);
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching Post"));
  }
};

export const createPost = async (req, res, next) => {
  try {
    const user = req.user;
    const { title, body } = req.body;

    if (!title || !body) return next(errorHandler(400, "Missing required fields"));
    if (title.length < 10) return next(errorHandler(400, "Title must be at least 10 characters long"));
    if (body.length < 10) return next(errorHandler(400, "Body must be at least 10 characters long"));

    await asyncQuery("INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)", [user.uid, title, body]);
    return res.status(201).json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal Server Error While Creating Post"));
  }
};

export const editPost = async (req, res) => {};
export const deletePost = async (req, res) => {};
