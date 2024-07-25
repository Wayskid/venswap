import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createPayment,
  getUserPayments,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.get("/", verifyToken, getUserPayments);
paymentRouter.post("/create/:user_id/:business_id", verifyToken, createPayment);

export default paymentRouter;
