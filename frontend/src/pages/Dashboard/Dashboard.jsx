import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "../../store/slices/superAdminSlice";
import React, { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../custom-components/Spinner";

// Lazy load sub-components
const AuctionItemDelete = lazy(() =>
  import("./sub-components/AuctionItemDelete")
);
const BiddersAuctioneersGraph = lazy(() =>
  import("./sub-components/BiddersAuctioneersGraph")
);
const PaymentGraph = lazy(() => import("./sub-components/PaymentGraph"));
const PaymentProofs = lazy(() => import("./sub-components/PaymentProofs"));

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(clearAllSuperAdminSliceErrors());
    // eslint-disable-next-line
  }, []);

  const { user, role, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const protectedUser = user.success ? user.user : user;
  useEffect(() => {
    if (protectedUser.role !== "Super Admin") {
      navigateTo("/");
    }
  }, [role, navigateTo]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col gap-10">
          <h1
            className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            Dashboard
          </h1>
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                Monthly Total Payments Received
              </h3>
              <Suspense fallback={<Spinner />}>
                <PaymentGraph />
              </Suspense>
            </div>
            <div>
              <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                Users
              </h3>
              <Suspense fallback={<Spinner />}>
                <BiddersAuctioneersGraph />
              </Suspense>
            </div>
            <div>
              <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                Payment Proofs
              </h3>
              <Suspense fallback={<Spinner />}>
                <PaymentProofs />
              </Suspense>
            </div>
            <div>
              <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                Delete Items From Auction
              </h3>
              <Suspense fallback={<Spinner />}>
                <AuctionItemDelete />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
