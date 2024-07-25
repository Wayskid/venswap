import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) throw new Error("Access Denied");

    if (token.startsWith("Bearer")) token = token.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verified.id).select("-password");
    next();
  } catch (error) {
    res.status(500).json(error.message);
  }
};
