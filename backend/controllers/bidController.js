import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/UserSchema.js";

export const placeBid = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }

  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction item not found.", 404));
  }
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return next(new ErrorHandler("Please provide a valid bid amount.", 400));
  }
  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than the current bid.", 400)
    );
  }
  if (amount <= auctionItem.startingPrice) {
    return next(
      new ErrorHandler("Bid amount must be greater than the starting bid.", 400)
    );
  }

  try {
    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });
  


    const existingBidAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() === req.user._id.toString()
    );
    

   
    if (existingBid && existingBidAuction) {
      existingBid.amount = amount;
      existingBidAuction.amount = amount;
      auctionItem.currentBid = amount;
   
      await existingBid.save();
      await existingBidAuction.save();
      await auctionItem.save();
    } else {
      const newBid = await Bid.create({
        amount,
        bidder: {
          id: req.user._id,
          username: req.user.username,
          profilePicture: req.user.profilePicture?.url,
        },
        auctionItem: auctionItem._id,
      });
      await auctionItem.bids.push({
        userId: req.user._id,
        username: req.user.username,
        profilePicture: req.user.profilePicture?.url,

        amount,
      });
      auctionItem.currentBid = amount;
    }

    auctionItem.save();
  
    res.status(200).json({
      success: true,
      message: "Bid placed successfully.",
      currentBid: auctionItem.currentBid,
    });
  } catch (e) {
    return next(
      new ErrorHandler(e.message || "Error placing bid. Please try again.", 500)
    );
  }
});
