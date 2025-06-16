import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/UserSchema.js";
import {v2 as cloudinary} from "cloudinary";
import asyncHandler from "express-async-handler";
import { generateToken } from "../utils/generateToken.js";

export const  register=asyncHandler( async (req, res, next) => {
    if(!req.files||Object.values(req.files).length===0){
        return next(new ErrorHandler("profile photo is required",400));
    }
    const {profilePhoto} = req.files;
 
    const allowedFileTypes=["image/png", "image/jpg", "image/jpeg","image/webp"];
    if(!allowedFileTypes.includes(profilePhoto.mimetype)){
        return next(new ErrorHandler("Invalid file type",400));
    }

    const {email,password,username,address,phone,role,bankAccountNumber,bankAccountName,bankName,paypalEmail} = req.body;
    if(!email || !password || !username || !address || !phone || !role){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
   if(role==="Auctioneer"){
    if(!bankAccountNumber || !bankAccountName || !bankName){
        return next(new ErrorHandler("Please fill bank details",400));
    }
    if(!paypalEmail){
        return next(new ErrorHandler("Please fill paypal details",400));
    }
   }
   const existingUser = await User.findOne({email});
   if(existingUser){
        return next(new ErrorHandler("User already exists",400));
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(profilePhoto.tempFilePath,{
        folder:"MERN_AUCTION_PLATFORM_USERS"
    })
    if(!cloudinaryResponse||cloudinaryResponse.error){
        console.error("Cloudinary upload error:", cloudinaryResponse.error);
    return next(new ErrorHandler("failed to upload profile picture to cloudinary",500));
    }

    const user = await User.create({
        username,
        email,
        password,
        address,
        phone,
        profilePicture:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        },
        paymentMethods:{
            bankTransfer:{
                bankAccountNumber,
                bankAccountName,
                bankName
            },
            paypal:{
                paypalEmail
            }
        },
        role
    
    });
   generateToken(user,201,"user registered successfully",res);
}
)
export const login = asyncHandler(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    generateToken(user,200,"user logged in successfully",res);

})
export const getProfile=asyncHandler(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user
    });
})
export const logout=asyncHandler(async(req,res,next)=>{
    res.cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true
    }).json({
        success:true,
        message:"Logged out successfully"
    });
})
export const leaderboard=asyncHandler(async(req,res,next)=>{
    const leaderboard=await User.find({moneySpent:{$gt:0}}).sort({moneySpent:-1})
    res.status(200).json({
        success:true,
        leaderboard
    });
})