import errorHandler from "../middleware/errorHandler.js";
import { asyncQuery } from "../utils/asyncQuery.js";

export const fetchPosts = async (req, res, next) => {
  try {
    const limit = Number(req.params.limit) || 10;

    console.log("fetching posts");
    const voteCountQuery = `(SELECT COUNT(*) FROM post_votes pv WHERE pv.post_id = p.id AND pv.vote_type = 'upvote') - (SELECT COUNT(*) FROM post_votes pv WHERE pv.post_id = p.id AND pv.vote_type = 'downvote') AS vote_count`;
    const tagsQuery = `(SELECT JSON_ARRAYAGG(t.name) FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id) AS tags`;

    const posts = await asyncQuery(
      `SELECT p.id, p.title, p.timestamp, u.username AS username, u.uid as user_id, ${voteCountQuery}, ${tagsQuery} FROM posts p JOIN users u ON p.user_id = u.uid ORDER BY p.timestamp DESC LIMIT ?`,
      [limit]
    );

    posts.forEach((post) => {
      post.id = Math.random();
    });


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

    return res.status(200).json(post[0]);
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
