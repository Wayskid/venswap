import express from "express";
import {
  createMessage,
  editOfferMessage,
  getMessages,
  readMessage,
  updatePaymentStatus,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/auth.js";

const messageRoute = express.Router();

messageRoute.get("/:chat_id", verifyToken, getMessages);
messageRoute.post("/create/:sender_id", verifyToken, createMessage);
messageRoute.patch(
  "/edit_offer/:sender_id/:message_id",
  verifyToken,
  editOfferMessage
);
messageRoute.patch(
  "/edit_status/:message_id/:payment_id",
  verifyToken,
  updatePaymentStatus
);
messageRoute.patch("/read_message/:message_id", verifyToken, readMessage);

export default messageRoute;
