import admin from "../config/fb_admin.js";
import errorHandler from "./error_handler.js";

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split("Bearer ")[1];

  if (!token) return next(errorHandler(401, "No token provided"));
  const decodedToken = await admin.auth().verifyIdToken(token);

  if (!decodedToken) return next(errorHandler(401, "Invalid token"));
  if (!decodedToken.email_verified) return next(errorHandler(401, "Email not verified"));

  req.user = decodedToken;
  return next();
};

export { verifyToken };
