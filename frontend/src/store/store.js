import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices";
import commissionReducer from "./slices/commissionSlice.js";
import auctionReducer from "./slices/auctionSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    commission: commissionReducer,
    auction: auctionReducer,
  },
});
