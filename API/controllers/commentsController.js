import pool from "../config/pool.js";
import errorHandler from "../middleware/errorHandler.js";

export const fetchComments = async (req, res, next) => {
  try {
    const limit = req.query.limit || "10";
    const { postId, alreadyFetchedRootComments } = req.params;

    if (!postId) return next(errorHandler(400, "Missing required fields"));

    const [rootComments] = await pool.execute(
      `SELECT u.username, c.id, c.user_id, c.post_id, c.parent_comment_id, c.content, c.timestamp FROM comments c
      JOIN users u ON c.user_id = u.uid       

      WHERE c.post_id = ? AND c.parent_comment_id IS NULL 
      ORDER BY c.timestamp LIMIT ?`,

      [postId, limit]
    );

    const getReplies = async (comment) => {
      const [replies] = await pool.execute(
        `SELECT u.username, c.id, c.user_id, c.post_id, c.parent_comment_id, c.content, c.timestamp FROM comments c
      JOIN users u ON c.user_id = u.uid

      WHERE c.parent_comment_id = ? 
      ORDER BY c.timestamp`,

        [comment.id]
      );

      for (const reply of replies) {
        reply.replies = await getReplies(reply);
      }

      return replies;
    };

    const comments = await Promise.all(
      rootComments.map(async (comment) => {
        comment.replies = await getReplies(comment);
        return comment;
      })
    );

    console.log(comments);
    return res.status(200).json(comments);
  } catch (error) {
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching Comments"));
  }
};

export const createComment = async (req, res, next) => {
  try {
    const user = req.user;
    const { postId, parentCommentId, content } = req.body;

    if (!postId || !content) {
      return next(errorHandler(400, "Missing required fields"));
    }

    if (content.length < 1) {
      return next(errorHandler(400, "Content must be at least 1 characters long"));
    }

    await pool.execute("INSERT INTO comments (user_id, post_id, parent_comment_id, content) VALUES (?, ?, ?, ?)", [
      user.uid,
      postId,
      parentCommentId || null,
      content,
    ]);

    return res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, error.message || "Internal Server Error While Creating Comment"));
  }
};
export const editComment = async (req, res, next) => {};
export const deleteComment = async (req, res, next) => {};
