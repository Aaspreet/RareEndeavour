import errorHandler from "../middleware/errorHandler.js";
import { asyncQuery } from "../utils/asyncQuery.js";

export const fetchComments = async (req, res, next) => {
  try {
    const { postId, quantity } = req.body;
    if (!postId) return next(errorHandler(400, "Missing required fields"));

    const rootComments = await asyncQuery(
      "SELECT * FROM comments WHERE post_id = ? AND parent_comment_id IS NULL LIMIT ?",
      [postId, quantity || 10]
    );

    const getReplies = async (comment) => {
      const replies = await asyncQuery("SELECT * FROM comments WHERE parent_comment_id = ?", [comment.id]);

      for (const reply of replies) {
        const username = await asyncQuery("SELECT username FROM users WHERE uid = ?", [reply.user_id]);
        reply.username = username[0].username;
        reply.replies = await getReplies(reply);
      }

      return replies;
    };

    const comments = await Promise.all(
      rootComments.map(async (comment) => {
        const username = await asyncQuery("SELECT username FROM users WHERE uid = ?", [comment.user_id]);
        const replies = await getReplies(comment);

        return { ...comment, username: username[0].username, replies };
      })
    );

    console.log(comments);

    // const comments = rootComments;

    return res.status(200).json({ success: true, comments });
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

    await asyncQuery("INSERT INTO comments (user_id, post_id, parent_comment_id, content) VALUES (?, ?, ?, ?)", [
      user.uid,
      postId,
      parentCommentId || null,
      content,
    ]);

    return res.status(201).json({ success: true, message: "Comment created successfully" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, error.message || "Internal Server Error While Creating Comment"));
  }
};
export const editComment = async (req, res, next) => {};
export const deleteComment = async (req, res, next) => {};
