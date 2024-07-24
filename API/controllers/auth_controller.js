import { asyncQuery } from "../utils/async_query.js";

export const register = async (req, res, next) => {
  try {
    const user = req.user;
    const username = req.body.username;
    console.log(user);
    const userByUsername = await asyncQuery("FIND users WHERE uid = ?", [user.uid]);
    console.log(userByUsername);

    await asyncQuery("INSERT INTO users (uid, username) VALUES (?, ?)", [user.uid, username]);
  } catch (error) {}
};
