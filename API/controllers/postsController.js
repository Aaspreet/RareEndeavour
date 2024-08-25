import pool from "../config/pool.js";
import errorHandler from "../middleware/errorHandler.js";

export const fetchPosts = async (req, res, next) => {
  try {
    console.log("fetching posts");
    const limit = req.query.limit || "10";

    const [posts] = await pool.execute(
      `SELECT p.id, p.title, p.timestamp, u.username AS username, u.uid as user_id, 
      (SELECT COUNT(*) FROM post_votes pv WHERE pv.post_id = p.id AND pv.vote_type = 'upvote') - (SELECT COUNT(*) FROM post_votes pv WHERE pv.post_id = p.id AND pv.vote_type = 'downvote') AS vote_count, 
      (SELECT JSON_ARRAYAGG(t.name) FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id) AS tags FROM posts p

      JOIN users u ON p.user_id = u.uid ORDER BY p.timestamp DESC LIMIT ?`,

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
    console.log("fetching single post");
    const { postId } = req.params;
    if (!postId) return next(errorHandler(400, "No post found"));

    const [[post]] = await pool.execute(
      `SELECT p.id, p.title, p.timestamp, p.body, u.username AS username, u.uid as user_id, 
      (SELECT COUNT(*) FROM post_votes pv WHERE pv.post_id = p.id AND pv.vote_type = 'upvote') - (SELECT COUNT(*) FROM post_votes pv WHERE pv.post_id = p.id AND pv.vote_type = 'downvote') AS vote_count, 
      (SELECT JSON_ARRAYAGG(t.name) FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id) AS tags FROM posts p 

      JOIN users u ON p.user_id = u.uid WHERE p.id = ?`,

      [postId]
    );

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching Posts"));
  }
};

export const createPost = async (req, res, next) => {
  // try {
  //   const user = req.user;
  //   const { title, body } = req.body;
  //   if (!title || !body) return next(errorHandler(400, "Missing required fields"));
  //   if (title.length < 10) return next(errorHandler(400, "Title must be at least 10 characters long"));
  //   if (body.length < 10) return next(errorHandler(400, "Body must be at least 10 characters long"));
  //   await pool.execute("INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)", [user.uid, title, body]);
  //   return res.status(201).json({ success: true, message: "Post created successfully" });
  // } catch (error) {
  //   console.log(error);
  //   return next(errorHandler(500, error.message || "Internal Server Error While Creating Post"));
  // }
};

export const editPost = async (req, res) => {};
export const deletePost = async (req, res) => {};
