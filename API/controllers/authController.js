import db from "../config/pool.js";
import admin from "../config/fbAdmin.js";
import errorHandler from "../middleware/errorHandler.js";
import pool from "../config/pool.js";

export const register = async (req, res, next) => {
  let connection;
  try {
    const user = req.user;
    const username = req.body.username;

    connection = await pool.getConnection();

    const [[uidExists]] = await connection.query("SELECT EXISTS ( SELECT 1 FROM users WHERE uid = ? )", [user.uid]);
    if (Object.values(uidExists)[0]) return next(errorHandler(400, "This account already has a username..."));

    const [[usernameExists]] = await connection.query("SELECT EXISTS ( SELECT 1 FROM users WHERE username = ? )", [
      username,
    ]);
    if (Object.values(usernameExists)[0]) return next(errorHandler(400, "Username already exists"));

    try {
      await connection.beginTransaction();

      await pool.query("INSERT INTO users (uid, username) VALUES (?, ?)", [user.uid, username]);
      await admin.auth().setCustomUserClaims(user.uid, { hasUsername: true });

      await connection.commit().then(() => console.log("committed"));
    } catch (error) {
      await connection.rollback();
      return next(errorHandler(500, "Internal server error while registering."));
    }

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, error.message || "Internal server error while registering."));
  } finally {
    connection.release();
  }
};
