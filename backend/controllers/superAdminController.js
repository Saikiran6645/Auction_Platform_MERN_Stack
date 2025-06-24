import mongoose from "mongoose";
import { User } from "../models/UserSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Commission } from "../models/commisionSchema.js";
export const deleteAuctionItem = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findByIdAndDelete(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction item not found.", 404));
  }
  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully",
    auctionItem,
  });
});
export const getAllPaymentProofs = expressAsyncHandler(
  async (req, res, next) => {
    const proofs = await PaymentProof.find().populate("userId", "username");
    if (!proofs || proofs.length === 0) {
      return next(new ErrorHandler("No payment proofs found", 404));
    }
    res.status(200).json({
      success: true,
      proofs,
    });
  }
);
export const getAllPaymentProofsDetails = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid Id format.", 400));
    }
    const proofs = await PaymentProof.findById(id);
    if (!proofs) {
      return next(new ErrorHandler("Payment proof not found", 404));
    }
    res.status(200).json({
      success: true,
      proofs,
    });
  }
);
export const updateProofStatus = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const paymentProofItem = await PaymentProof.findById(id);
  if (!paymentProofItem) {
    return next(new ErrorHandler("Payment proof not found", 404));
  }
  const { amount, status } = req.body;
  if (!amount || !status) {
    return next(new ErrorHandler("Please provide amount and status", 400));
  }
  await paymentProofItem.findByIdAndUpdate(
    id,
    {
      amount,
      status,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: true,
    message: "Payment proof status updated successfully",
    paymentProofItem,
  });
});
export const deletePaymentProof = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid Id format.", 400));
    }
    const paymentProofItem = await PaymentProof.findByIdAndDelete(id);

    if (!paymentProofItem) {
      return next(new ErrorHandler("Payment proof not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Payment proof deleted successfully",
      paymentProofItem,
    });
  }
);
export const fetchAllUsers = expressAsyncHandler(async (req, res, next) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
      },
    },
    {
      $sort: {
        year: 1,
        month: 1,
      },
    },
  ]);

  const bidders = users.filter((user) => user.role === "Bidder");
  const auctioneers = users.filter((user) => user.role === "Auctioneer");
  const tranformDataToMonthlyArray = (data, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    data.forEach((item) => {
      result[item.month - 1] = item.count;
    });

    return result;
  };

  const biddersData = tranformDataToMonthlyArray(bidders);
  const auctioneersData = tranformDataToMonthlyArray(auctioneers);

  res.status(200).json({
    success: true,
    bidders: biddersData,
    auctioneers: auctioneersData,
  });
});
export const monthlyRevenue = expressAsyncHandler(async (req, res, next) => {
  const payments = await Commission.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const tranformDataToMonthlyArray = (payments, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    payments.forEach((payment) => {
      result[payment._id.month - 1] = payment.totalAmount;
    });

    return result;
  };

  const totalMonthlyRevenue = tranformDataToMonthlyArray(payments);
  res.status(200).json({
    success: true,
    totalMonthlyRevenue,
  });
});
