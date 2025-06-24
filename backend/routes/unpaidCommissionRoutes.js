import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authentication.js";
import { proofOfCommission } from "../controllers/commissionController.js";

const router = express.Router();
// Route to handle proof of commission submission
router.post(
  "/proof",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  proofOfCommission
);

// Export the router
export default router;
