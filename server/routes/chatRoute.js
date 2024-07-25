import express from "express";
import {
  createChat,
  getChats,
  getOneChat,
} from "../controllers/chatController.js";
import { verifyToken } from "../middleware/auth.js";

const chatRoute = express.Router();

chatRoute.get("/:user_id", verifyToken, getChats);
chatRoute.get("/chat_details/:user_id/:chat_id", verifyToken, getOneChat);
chatRoute.post("/create/:user_id", verifyToken, createChat);

export default chatRoute;
