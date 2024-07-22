import express from "express";
import http from "http";
import cors from "cors";
import authRouter from "./routes/auth_router.js";
import testRouter from "./routes/test_router.js";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use('/api/test', testRouter)
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || err.code || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
