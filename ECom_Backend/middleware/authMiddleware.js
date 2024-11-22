import jwt from "jsonwebtoken";
import User from "../User/models/userModel.js";

// Middleware to verify the token and authenticate the user
export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "ABCD");
    req.user = decoded;

    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access Denied. Admins only." });
  }
  next();
};
