import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authentication.js";
import { placeBid } from "../controllers/bidController.js";
import { checkAuctionEndTime } from "../middlewares/AuctionEndCheck.js";

const router = express.Router();

router.post(
  "/place/:id",
  isAuthenticated,
  isAuthorized("Bidder"),
  checkAuctionEndTime,
  placeBid
);

export default router;
