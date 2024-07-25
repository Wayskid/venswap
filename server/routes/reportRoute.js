import express from "express";
import { getReports, reportBusiness } from "../controllers/reportController.js";

const reportRoute = express.Router();

reportRoute.get("/", getReports);
reportRoute.post("/create/:user_id/:business_id", reportBusiness);

export default reportRoute;
