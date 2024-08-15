import errorHandler from "../middleware/errorHandler.js";
import { asyncQuery } from "../utils/asyncQuery.js";

export const register = async (req, res, next) => {
  try {
    const user = req.user;
    const username = req.body.username;

    const uidExists = await asyncQuery("SELECT EXISTS ( SELECT 1 FROM users WHERE uid = ? )", [user.uid]);
    if (Object.values(uidExists[0])[0]) return next(errorHandler(400, "This account already has a username..."));

    const usernameExists = await asyncQuery("SELECT EXISTS ( SELECT 1 FROM users WHERE username = ? )", [username]);
    if (Object.values(usernameExists[0])[0]) return next(errorHandler(400, "Username already exists"));

    await asyncQuery("INSERT INTO users (uid, username) VALUES (?, ?)", [user.uid, username]);
    return res.status(201).json({ success: true, message: "User registered successfully!" });
    
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal server error while registering."));
  }
};
