import admin from "../config/fbAdmin.js";
import errorHandler from "./errorHandler.js";

const verifyTokenRequired = async (req, res, next) => {
  console.log('here')
  if (!req.headers.authorization) return next(errorHandler(401, "No token provided"));
  const token = req.headers.authorization.split("Bearer ")[1];

  if (!token) return next(errorHandler(401, "No token provided"));
  const decodedToken = await admin.auth().verifyIdToken(token);

  if (!decodedToken) return next(errorHandler(401, "Invalid token"));
  if (!decodedToken.email_verified) return next(errorHandler(401, "Email not verified"));

  req.user = decodedToken;
  return next();
};

const verifyTokenOptional = async (req, res, next) => {
  if (!req.headers.authorization) {
    req.user = null;
    return next();
  }
  const token = req.headers.authorization.split("Bearer ")[1];

  if (!token) {
    req.user = null;
    return next();
  }
  const decodedToken = await admin.auth().verifyIdToken(token);

  if (!decodedToken) {
    req.user = null;
    return next();
  }
  if (!decodedToken.email_verified) {
    req.user = null;
    return next();
  }

  req.user = decodedToken;
  return next();
};

export { verifyTokenRequired, verifyTokenOptional };
