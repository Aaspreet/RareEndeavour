import errorHandler from "../middleware/error_handler.js";
import { asyncQuery } from "../utils/async_query.js";

export const getUsername = async (req, res, next) => {
  try {
    const user = req.user;
    const username = await asyncQuery("SELECT username FROM users WHERE uid = ?", [user.uid]);
    console.log(username + " logging from user_controller getUsername");
    return res.status(200).json({ success: "true", username: username[0]?.username || null });
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching Username"));
  }
};

export const getProfilePicture = async (req, res, next) => {
  try {
    const user = req.user;
    const profilePicture = await asyncQuery("SELECT profile_picture FROM users WHERE uid = ?", [user.uid]);
    return res.status(200).json({ success: true, profile_picture: profilePicture[0]?.profile_picture || null });
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching Profile Picture"));
  }
};

export const getTimeStamp = async (req, res, next) => {
  try {
    const user = req.user;
    const timeStamp = await asyncQuery("SELECT timestamp FROM users WHERE uid = ?", [user.uid]);
    return res.status(200).json({ success: true, timestamp: timeStamp[0]?.timestamp || null });
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching Date Created"));
  }
};

export const updateProfilePicture = async (req, res, next) => {
  try {
    const user = req.user;
    const profilePicture = req.body.profile_picture;

    await asyncQuery("UPDATE users SET profile_picture = ? WHERE uid = ?", [profilePicture, user.uid]);
    return res.status(200).json({ success: true, message: "Profile picture updated successfully" });
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal Server Error While Updating Profile Picture"));
  }
};
