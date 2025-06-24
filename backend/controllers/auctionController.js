import { Auction } from "../models/auctionSchema.js";
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/UserSchema.js";
import mongoose from "mongoose";
import { Bid } from "../models/bidSchema.js";

export const createAuction = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.values(req.files).length === 0) {
    return next(new ErrorHandler("Auction image is required", 400));
  }
  const {
    title,
    description,
    startingPrice,
    startTime,
    endTime,
    condition,
    category,
  } = req.body;
  if (
    !title ||
    !description ||
    !startingPrice ||
    !startTime ||
    !endTime ||
    !condition ||
    !category
  ) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }
  const validFileTypes = ["image/png", "image/jpeg", "image/webp"];
  const { image } = req.files;
  if (!validFileTypes.includes(image.mimetype)) {
    return next(new ErrorHandler("Invalid file type", 400));
  }
  if (new Date(startTime) <= Date.now()) {
    return next(new ErrorHandler("Start time must be in the future", 400));
  }
  if (new Date(startTime) >= new Date(endTime)) {
    return next(new ErrorHandler("Start time must be before end time", 400));
  }
  const alreadyAuctionExists = await Auction.find({
    createdBy: req.user._id,
    endTime: { $gt: Date.now() },
  });
  if (alreadyAuctionExists.length > 0) {
    return next(new ErrorHandler("You already have one aution active", 400));
  }
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "MERN_AUCTION_PLATFORM_AUCTIONS",
      }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary upload error:", cloudinaryResponse.error);
      return next(
        new ErrorHandler("Failed to upload auction image to Cloudinary", 500)
      );
    }
    const newAuction = await Auction.create({
      title,
      description,
      condition,
      category,
      startingPrice,
      startTime,
      endTime,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      createdBy: req.user._id,
    });
    newAuction.save();
    res.status(201).json({
      success: true,
      message: "Auction created successfully",
      auction: newAuction,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "failed to create auction", 500)
    );
  }
});
export const getAllItems = asyncHandler(async (req, res, next) => {
  const auctions = await Auction.find();
  if (!auctions || auctions.length === 0) {
    return next(new ErrorHandler("No auctions found", 404));
  }
  res.status(200).json({
    success: true,
    auctions,
  });
});
export const getMyAuctionItems = asyncHandler(async (req, res, next) => {
  const auctions = await Auction.find({ createdBy: req.user._id });
  if (!auctions || auctions.length === 0) {
    return next(new ErrorHandler("No auctions found", 404));
  }
  res.status(200).json({
    success: true,
    auctions,
  });
});
export const getAuctionDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found", 404));
  }
  const bids = auctionItem.bids.sort((a, b) => b.amount - a.amount);

  res.status(200).json({
    success: true,
    auctionItem,
    bids,
  });
});

export const removeFromAuction = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});
export const repulishAuction = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }

  let auction = await Auction.findById(id);
  if (!req.body.startTime && !req.body.endTime) {
    return next(
      new ErrorHandler("Please provide start time and end time", 400)
    );
  }
  if (!auction) {
    return next(new ErrorHandler("Auction not found", 404));
  }
  if (new Date(auction.endTime) > Date.now()) {
    return next(
      new ErrorHandler("You can only republish auctions that have ended", 400)
    );
  }
  const data = {
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
  };
  if (data.startTime <= Date.now()) {
    return next(new ErrorHandler("Start time must be in the future", 400));
  }
  if (data.startTime >= data.endTime) {
    return next(new ErrorHandler("Start time must be before end time", 400));
  }
  if (auction.highestBidder) {
    const highestBidder = await User.findById(auction.highestBidder);
    highestBidder.moneySpent -= auction.currentBid;
    highestBidder.auctionsWon -= 1;
    await highestBidder.save();
  }

  data.bids = [];
  data.commissionCalculated = false;
  data.currentBid = 0;
  data.highestBidder = null;
  await Bid.deleteMany({ auctionItem: auction._id });
  auction = await Auction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  });
  const createdBy = await User.findById(req.user._id);
  if (!createdBy) {
    return next(new ErrorHandler("User not found", 404));
  }
  createdBy.unpaidCommissions = 0;
  createdBy.save();

  res.status(200).json({
    success: true,
    message: `Auction republished successfully and Auction will start at ${req.body.startTime}`,
    auction,
    createdBy,
  });
});
