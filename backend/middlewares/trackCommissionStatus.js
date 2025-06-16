import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { User } from "../models/UserSchema";
import ErrorHandler from "./error";

export const trackCommissionStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user.unpaidCommissions > 0) {
    return next(new ErrorHandler("You have unpaid commissions", 403));
  }
  next();
});
