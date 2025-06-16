import express from "express";
import {
  createAuction,
  getAllItems,
  getMyAuctionItems,
  removeFromAuction,
  repulishAuction,
} from "../controllers/auctionController.js";
const router = express.Router();
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authentication.js";
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  createAuction
);
router.get("/allitems", getAllItems);
router.get("/auction/:id", isAuthenticated, getAllItems); // Assuming you want to get auction details by ID
router.get(
  "/myitems",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  getMyAuctionItems
);
router.put(
  "/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  repulishAuction
); // Re-publish an auction item
router.delete(
  "/remove/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  removeFromAuction
);

export default router;
