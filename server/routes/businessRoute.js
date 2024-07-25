import express from "express";
import {
  createBusiness,
  deleteBusiness,
  getUserBusinesses,
  editBusiness,
  getBusinesses,
  getOneBusiness,
  getEnquiries,
  getOrders,
  featureBusiness,
  getSavedBusinesses,
  accountOverview,
} from "../controllers/businessController.js";
import { verifyToken } from "../middleware/auth.js";

const businessRoute = express.Router();

businessRoute.get("/", getBusinesses);
businessRoute.post("/saved", getSavedBusinesses);
businessRoute.get("/business_details/:business_id", getOneBusiness);
businessRoute.get("/user_listing/:user_id", getUserBusinesses);
businessRoute.post("/create/:seller_id", verifyToken, createBusiness);
businessRoute.patch("/edit/:seller_id/:business_id", verifyToken, editBusiness);
businessRoute.delete(
  "/delete/:user_id/:business_id",
  verifyToken,
  deleteBusiness
);
businessRoute.get("/enquiries/:seller_id", verifyToken, getEnquiries);
businessRoute.get("/orders/:buyer_id", verifyToken, getOrders);
businessRoute.get("/overview/:user_id", verifyToken, accountOverview);

businessRoute.patch("/feature/:business_id", verifyToken, featureBusiness);

export default businessRoute;
