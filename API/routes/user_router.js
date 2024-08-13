import { Router } from "express";
import { getProfilePicture, getTimeStamp, getUsername, updateProfilePicture } from "../controllers/user_controller.js";
import { verifyTokenRequired } from "../middleware/verify_token.js";

const router = Router();

router.get("/get_username", verifyTokenRequired, getUsername);
router.get("/get_profile_picture", verifyTokenRequired, getProfilePicture);
router.get("/get_date_created", verifyTokenRequired, getTimeStamp);

router.post("/update_profile_picture", verifyTokenRequired, updateProfilePicture);

export default router;
