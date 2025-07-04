import mongoose from "mongoose";

const proofOfCommissionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  proof: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  amount: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  uploadAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected", "Settled"],
  },
});
export const PaymentProof = mongoose.model(
  "PaymentProof",
  proofOfCommissionSchema
);
