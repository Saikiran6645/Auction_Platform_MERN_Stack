import { config } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoutes from "./routes/userRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import bidRoutes from "./routes/bidRouter.js";
import commissionRoutes from "./routes/unpaidCommissionRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import { endedAuctionCron } from "./automation/endedAucttionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";
const app = express();
config({
  path: "./config/config.env",
});
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],

    credentials: true, // Allow credentials to be sent
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auction", auctionRoutes);
app.use("/api/v1/bid", bidRoutes);
app.use("/api/v1/commission", commissionRoutes);
app.use("/api/v1/superadmin", superAdminRoutes);
endedAuctionCron(); // Start the cron job to check for ended auctions
verifyCommissionCron();
// Connect to the database
connection();
app.use(errorMiddleware);

export default app;
