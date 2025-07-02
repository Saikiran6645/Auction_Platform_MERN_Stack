import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { calculateCommission } from "../controllers/commissionController.js";
import { User } from "../models/UserSchema.js";
import { Bid } from "../models/bidSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
 
    const now = new Date();
    const auctions = await Auction.find({
      endTime: { $lt: now },
      commisionClaculated: false,
    });
    for (const auction of auctions) {
      try {
        const commissionAmount = await calculateCommission(auction._id);
        auction.commisionClaculated = true;
        const highestBidder = await Bid.findOne({
          auctionItem: auction._id,
          amount: auction.currentBid,
        });
        const auctioneer = await User.findById(auction.createdBy);
        auctioneer.unpaidCommissions += commissionAmount;

        await auctioneer.save();
        if (highestBidder) {
          auction.highestBidder = highestBidder.bidder.id;
          await auction.save();
          const bidder = await User.findById(highestBidder.bidder.id);
          await User.findByIdAndUpdate(
            {
              _id: highestBidder.bidder.id,
            },
            {
              $inc: { moneySpent: highestBidder.amount },
            },
            {
              new: true,
            }
          );

          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${bidder.username}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email} \n\nPlease complete your payment using one of the following methods:\n\n1. **Bank Transfer**: \n- Account Name: ${auctioneer.paymentMethods.bankTransfer.bankAccountName} \n- Account Number: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber} \n- Bank: ${auctioneer.paymentMethods.bankTransfer.bankName}\n\n2 \n\n3. **PayPal**:\n- Send payment to: ${auctioneer.paymentMethods.paypal.paypalEmail}\n\n4. **Cash on Delivery (COD)**:\n- If you prefer COD, you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront, use any of the above methods.\n- The remaining 80% will be paid upon delivery.\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is completed by [Payment Due Date]. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards,\nSai Kiran Auction Team`;
 
          sendEmail({ email: bidder.email, subject, message });
  
        } else {
          await auction.save();
        }
      } catch (error) {
        return console.error(error || "Some error in ended auction cron");
      }
    }
  });
};
