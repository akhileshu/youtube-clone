import jwt from "jsonwebtoken";
import { createError } from "./errorHandling.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
console.log(token)
  if (!token) return next(createError(401, "you are not authenticated"));
  jwt.verify(token, process.env.JWT, (err, userId) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return next(createError(403, "Token expired or not valid"));
    }
    req.user = userId;
    next();
  });

};
