import cron from "node-cron";
import { PaymentProof } from "../models/commissionProofSchema.js";
import { User } from "../models/UserSchema.js";
import { Commission } from "../models/commisionSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyCommissionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
  
    const paymentProof = await PaymentProof.find({
      status: "Approved",
    });
    for (const proof of paymentProof) {
      try {
        const user = await User.findById(proof.userId);
        let updatedUser = {};
        if (!user) {
          console.error(`User with ID ${proof.userId} not found.`);
          continue;
        }
        if (user.unpaidCommissions >= proof.amount) {
          updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
              $inc: {
                unpaidCommissions: -proof.amount,
              },
            },
            { new: true }
          );
          await PaymentProof.findOneAndUpdate(
            proof._id,
            {
              status: "Settled",
            },
            { new: true }
          );
        } else {
          updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
              unpaidCommissions: 0,
            },
            { new: true }
          );
          await PaymentProof.findOneAndUpdate(
            proof._id,
            {
              status: "Settled",
            },
            { new: true }
          );
        }
        const commission = await Commission.create({
          amount: proof.amount,
          user: user._id,
        });
        commission.save();
        const settlementDate = new Date(Date.now()).toString().substring(0, 15);

        const subject = `Your Payment Has Been Successfully Verified And Settled`;
        const message = `Dear ${user.username},\n\nWe are pleased to inform you that your recent payment has been successfully verified and settled. Thank you for promptly providing the necessary proof of payment. Your account has been updated, and you can now proceed with your activities on our platform without any restrictions.\n\nPayment Details:\nAmount Settled: ${proof.amount}\nUnpaid Amount: ${updatedUser.unpaidCommission}\nDate of Settlement: ${settlementDate}\n\nBest regards,\n sai kiran Auction Team`;
        sendEmail({ email: user.email, subject, message });
      
      } catch (error) {
        console.error(
          `Error processing commission proof for user ${proof.userId}: ${error.message}`
        );
      }
    }
  });
};
