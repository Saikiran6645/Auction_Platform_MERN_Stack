import { PaymentProof } from "../models/commissionProofSchema.js";
import ErrorHandler from "../middlewares/error.js";
import expressAsyncHandler from "express-async-handler";
import { User } from "../models/UserSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { Auction } from "../models/auctionSchema.js";
import { mongoose } from "mongoose";

export const calculateCommission = async (auctionId) => {
  const auction = await Auction.findById(auctionId);
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return next(new ErrorHandler("Invalid Auction Id format.", 400));
  }
  const commissionRate = 0.05;
  const commission = auction.currentBid * commissionRate;
  return commission;
};
export const proofOfCommission = expressAsyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Please upload a file", 400));
  }
  const { proof } = req.files;
  const allowedFileTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
  ];
  if (!allowedFileTypes.includes(proof.mimetype)) {
    return next(new ErrorHandler("Invalid file type", 400));
  }
  if (!req.body.amount || !req.body.comment) {
    return next(new ErrorHandler("Please provide amount and comment", 400));
  }
  const { amount, comment } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.unpaidCommissions === 0) {
    return next(new ErrorHandler("You have no unpaid commissions", 400));
  }
  if (amount <= 0) {
    return next(new ErrorHandler("Amount must be greater than zero", 400));
  }
  if (amount > user.unpaidCommissions) {
    return next(
      new ErrorHandler(
        `Amount exceeds unpaid commissions. please only pay ${user.unpaidCommissions}`,
        400
      )
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    proof.tempFilePath,
    {
      folder: "MERN_AUCTION_PLATFORM_PROOF_OF_COMMISSION",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary upload error:", cloudinaryResponse.error);
    return next(new ErrorHandler("Failed to upload file to Cloudinary", 500));
  }
  const commissionProof = await PaymentProof.create({
    userId: req.user._id,
    amount,
    comment,
    proof: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    status: "Pending",
  });
  res.status(201).json({
    success: true,
    message: "Commission proof uploaded successfully",
    commissionProof,
  });
});
