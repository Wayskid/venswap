import express from "express";
import {
  getSavedCount,
  getViewCount,
  updateSavedCount,
  updateViewCount,
} from "../controllers/analyticsController.js";
import { verifyToken } from "../middleware/auth.js";

const analyticsRoute = express.Router();

analyticsRoute.get(
  "/views_count/:user_id/:business_id",
  verifyToken,
  getViewCount
);
analyticsRoute.post(
  "/views_count/create/:user_id",
  verifyToken,
  updateViewCount
);
analyticsRoute.get(
  "/saved_count/:user_id/:business_id",
  verifyToken,
  getSavedCount
);
analyticsRoute.post(
  "/saved_count/create/:user_id",
  verifyToken,
  updateSavedCount
);

export default analyticsRoute;
