import express from "express";
import http from "http";
import cors from "cors";
import authRouter from "./routes/auth_router.js";
import userRouter from "./routes/user_router.js";
import postsRouter from "./routes/posts_router.js";
import commentsRouter from "./routes/comments_router.js";
import admin from "./config/fb_admin.js";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || err.code || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// const deleteAllUsers = async (nextPageToken) => {
//   // List batch of users, 1000 at a time.
//   const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

//   // Delete each user.
//   const deletionPromises = listUsersResult.users.map((user) => {
//     console.log(`Deleting user with UID: ${user.uid}`);
//     return admin.auth().deleteUser(user.uid);
//   });
//   await Promise.all(deletionPromises);

//   if (listUsersResult.pageToken) {
//     // If there are more users, delete them.
//     await deleteAllUsers(listUsersResult.pageToken);
//   }
// };

// deleteAllUsers().catch(console.error);
