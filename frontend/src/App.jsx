import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SideDrawer from "./layouts/SideDrawer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Suspense, lazy } from "react";
import { fetchLeaderboard, fetchUser } from "./store/slices/userSlices";
import { getAllAuctionItems } from "./store/slices/auctionSlice";
import ProtectedRoute from "./routes/ProtectedRoute";
// Direct import for Dashboard (not lazy)
import Dashboard from "./pages/Dashboard/Dashboard";
import Spinner from "../custom-components/Spinner";

// Lazy load other pages
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const SubmitCommission = lazy(() => import("./pages/submitCommission"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Leaderboard = lazy(() => import("./pages/LeaderBoard"));
const Auctions = lazy(() => import("./pages/Auctions"));
const AuctionItem = lazy(() => import("./pages/AuctionItem"));
const CreateAuction = lazy(() => import("./pages/createAuction"));
const ViewMyAuctions = lazy(() => import("./pages/ViewMyAuctions"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const About = lazy(() => import("./pages/AboutUs"));

function App() {
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.user);
  useEffect(() => {
   

    dispatch(fetchLeaderboard());
    dispatch(getAllAuctionItems());
  }, [dispatch]);

  return (
    <Router>
      <SideDrawer />
      <Suspense fallback={<Spinner />}>
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
          />
          <Route
            path="view-my-auctions"
            element={
              <ProtectedRoute>
                <ViewMyAuctions />
              </ProtectedRoute>
            }
          />
          <Route
            path="me"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="create-auction" element={<CreateAuction />} />
          <Route path="about" element={<About />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;
