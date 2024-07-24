import admin from "../config/fb_admin.js";

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split("Bearer ")[1];

  if (!token) next(errorHandler(401, "No token provided"));

  const decodedToken = await admin.auth().verifyIdToken(token);

  if (!decodedToken) next(errorHandler(401, "Invalid token"));
  if (!decodedToken.email_verified) next(errorHandler(401, "Email not verified"));

  req.user = decodedToken;
  next();
};

export { verifyToken };
