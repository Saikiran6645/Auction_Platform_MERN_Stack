import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingPrice: Number,
  startTime: String,
  endTime: String,
  currentBid: {
    type: Number,
    default: 0,
  },
  condition: {
    type: String,
    enum: ["New", "Used", "Refurbished"],
  },
  category: String,
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  bids: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
      username: String,
      profileImage: String,
      amount: Number,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commisionClaculated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Auction = mongoose.model("Auction", auctionSchema);
