import { Router } from "express";
import { register } from "../controllers/auth_controller.js";

const router = Router();

router.post("/register", register);
// router.get("/register", (req, res) => {
//     console.log("hellllo");
//   res.send("Hello");
// });

export default router;
