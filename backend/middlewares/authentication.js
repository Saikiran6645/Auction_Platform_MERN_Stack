import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {User} from "../models/UserSchema.js";

export const isAuthenticated=asyncHandler(async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decoded.id);
    if(!req.user){
        return next(new ErrorHandler("User not found",404));
    }
    next();
})
export const isAuthorized=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next();

    }
}