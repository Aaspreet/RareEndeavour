import pool from "../config/pool.js";
import errorHandler from "../middleware/errorHandler.js";

export const fetchUser = async (req, res, next) => {
  console.log("fetching Current User");
  try {
    const user = req.user;
    const [[fetchedUser]] = await pool.execute("SELECT uid, username, timestamp, quote FROM users WHERE uid = ?", [
      user.uid,
    ]);

    if (!fetchedUser) return next(errorHandler(404, "User not found"));

    return res.status(200).json(fetchedUser);
  } catch (error) {
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching User"));
  }
};

export const fetchTargetUser = async (req, res, next) => {
  console.log("fetching Target User");
  try {
    const uid = req.params.uid;

    const fetchedUser = await pool.execute("SELECT uid, username, timestamp, quote FROM users WHERE uid = ?", [uid]);

    if (fetchedUser.length === 0) return next(errorHandler(404, "User not found"));

    return res.status(200).json(fetchedUser[0]);
  } catch (error) {
    return next(errorHandler(500, error.message || "Internal Server Error While Fetching User"));
  }
};

export const updateQuote = async (req, res, next) => {};

// export const getUsername = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const username = await pool.execute("SELECT username FROM users WHERE uid = ?", [user.uid]);
//     return res.status(200).json({ success: "true", username: username[0]?.username || null });
//   } catch (error) {
//     return next(errorHandler(500, error.message || "Internal Server Error While Fetching Username"));
//   }
// };

// export const getProfilePicture = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const profilePicture = await pool.execute("SELECT profile_picture FROM users WHERE uid = ?", [user.uid]);
//     return res.status(200).json({ success: true, profile_picture: profilePicture[0]?.profile_picture || null });
//   } catch (error) {
//     console.log(error);
//     return next(errorHandler(500, error.message || "Internal Server Error While Fetching Profile Picture"));
//   }
// };

// export const getTimeStamp = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const timeStamp = await pool.execute("SELECT timestamp FROM users WHERE uid = ?", [user.uid]);
//     return res.status(200).json({ success: true, timestamp: timeStamp[0]?.timestamp || null });
//   } catch (error) {
//     console.log(error);
//     return next(errorHandler(500, error.message || "Internal Server Error While Fetching Date Created"));
//   }
// };

// export const updateProfilePicture = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const profilePicture = req.body.profile_picture;

//     await pool.execute("UPDATE users SET profile_picture = ? WHERE uid = ?", [profilePicture, user.uid]);
//     return res.status(200).json({ success: true, message: "Profile picture updated successfully" });
//   } catch (error) {
//     console.log(error);
//     return next(errorHandler(500, error.message || "Internal Server Error While Updating Profile Picture"));
//   }
// };
