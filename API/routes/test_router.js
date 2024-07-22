import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    console.log("get");
  res.send("get");
});

router.post("/", (req, res) => {
    console.log("post");
  res.send("post");
});

export default router;
