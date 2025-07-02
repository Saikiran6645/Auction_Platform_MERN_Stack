import { Button } from "@/components/ui/button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import SideDrawer from "./layouts/SideDrawer";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SubmitCommission from "./pages/submitCommission";
import HowItWorks from "./pages/HowItWorks";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./store/slices/userSlices";
import { getAllAuctionItems } from "./store/slices/auctionSlice";
import Leaderboard from "./pages/LeaderBoard";
import Auctions from "./pages/Auctions";
import AuctionItem from "./pages/AuctionItem";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateAuction from "./pages/createAuction";
import ViewMyAuctions from "./pages/ViewMyAuctions";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
  }, []);

  return (
    <Router>
      <SideDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="submitcommission" element={<SubmitCommission />} />
        <Route path="howitworks" element={<HowItWorks />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="auctions" element={<Auctions />} />
        <Route
          path="auction/item/:id"
          element={
            <ProtectedRoute>
              <AuctionItem />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="view-my-auctions"
          element={
            <ProtectedRoute>
              <ViewMyAuctions />
            </ProtectedRoute>
          }
        />
        <Route path="create-auction" element={<CreateAuction />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;
