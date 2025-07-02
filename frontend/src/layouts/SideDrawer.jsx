import React, { useState } from "react";
import { RiAuctionFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard } from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { logout } from "../store/slices/userSlices";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user, role } = useSelector((state) => state.user);
  useEffect(() => {
    if (user) {
      console.log(user);
      console.log(isAuthenticated);
    }
  }, []);
  const handleLogout = () => {
    dispatch(logout());
  };
  // if (isAuthenticated) {
  //   console.log(user.user);
  // }

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="fixed top-5 right-5 rounded-md p-2 bg-amber-700 hover:bg-[#e1d9d8] lg:hidden "
      >
        <GiHamburgerMenu />
      </div>
      <div
        className={`w-[100%] sm:w-[300px] h-full fixed bg-[#9bbbe6] ${
          show
            ? "left-0"
            : "left-[-100%] transition-all duration-150 p-4 flex flex-col justify-between lg:left-0 border-r-[1px] border-r-stone-500"
        } `}
      >
        <div className="relative pl-5">
          <Link to={"/"}>
            <h4 className="text-2xl font-semibold mb-4">
              Prime<span className="text-[#5e3c94]">Bid</span>
            </h4>
          </Link>
          <ul className="flex flex-col  gap-3">
            <li>
              <Link
                to={"/auctions"}
                className="flex text-xl font-semibold items-center gap-2 hover:text-[#D6482b] hover:transition-all hover:duration-150"
              >
                <RiAuctionFill /> Auctions
              </Link>
            </li>
            <li>
              <Link
                to={"/leaderboard"}
                className="flex text-xl font-semibold items-center gap-2 hover:text-[#D6482b] hover:transition-all hover:duration-150"
              >
                <MdLeaderboard /> LeaderBoard
              </Link>
            </li>
            {isAuthenticated && user && role === "Auctioneer" && (
              <>
                <li>
                  <Link
                    to={"/submitcommission"}
                    className="flex text-xl font-semibold items-center gap-2 hover:text-[#D6482b] hover:transition-all hover:duration-150"
                  >
                    <FaFileInvoiceDollar /> Submit Commission
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/create-auction"}
                    className="flex text-xl font-semibold items-center gap-2 hover:text-[#D6482b] hover:transition-all hover:duration-150"
                  >
                    <IoIosCreate /> Create Auction
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/view-my-auctions"}
                    className="flex text-xl font-semibold items-center gap-2 hover:text-[#D6482b] hover:transition-all hover:duration-150"
                  >
                    <FaEye /> View My Auctions
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && user && role === "Super Admin" && (
              <>
                <li>
                  <Link
                    to={"/dashboard"}
                    className="flex text-xl font-semibold items-center gap-2 hover:text-[#D6482b] hover:transition-all hover:duration-150"
                  >
                    <MdLeaderboard /> Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
          {!isAuthenticated ? (
            <>
              <div className="flex gap-2 ">
                <Link
                  to={"/signup"}
                  className="bg-[#D6482B] font-semibold hover:bg-[#b8381e] text-xl py-1 px-4 rounded-md text-white"
                >
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-transparent text-[#DECCBE] font-semibold  hover:bg-[#fffefd] hover:text-[#fdba88] text-xl py-1 px-4 rounded-md text-white border-2"
                >
                  Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="my-4 flex gap-4 w-fit onClick={handleLogout">
                <button
                  className="bg-[#D6482B] font-semibold hover:bg-[#b8381e] text-xl py-1 px-4 rounded-md text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          )}
          <hr className="mb-4 border-t-[#d6482b]"></hr>
          <ul className="flex gap-4 flex-col">
            {isAuthenticated && (
              <li>
                <Link
                  to={"/me"}
                  className="flex text-xl font-semibold gap-2 items-center hover:text-[#D6482b] hover:transition-all hover:duration-150"
                >
                  <FaUserCircle /> Profile
                </Link>
              </li>
            )}
            <li>
              <Link
                to={"/howitworks"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-[#D6482b] hover:transition-all hover:duration-150"
              >
                <SiGooglesearchconsole /> how it works
              </Link>
            </li>
            <li>
              <Link
                to={"/about"}
                className="flex text-xl font-semibold gap-2 items-center hover:text-[#D6482b] hover:transition-all hover:duration-150"
              >
                <BsFillInfoSquareFill /> About Us
              </Link>
            </li>
          </ul>
          <IoMdCloseCircleOutline
            className="absolute top-0 right-4 text-[28px] sm:hidden "
            onClick={() => setShow(!show)}
          />
        </div>
        <div>
          <div className="flex gap-3 mt-3 items-center mb-2 pl-4">
            <Link
              to={"/"}
              className="bg-white text-stone-500 p-2 text-x1 rounded-sm hover:text-blue-700"
            >
              <FaFacebook />
            </Link>
            <Link
              to={"/instagram.com"}
              className="bg-white text-stone-500 p-2 text-x1 rounded-sm hover:text-pink-700"
            >
              <RiInstagramFill />
            </Link>
          </div>
          <Link
            to={"/contact"}
            className="text-stone-500 font-semibold hover:text-[#d6482b] hover:transition-all hover:duration-150 pl-4"
          >
            Contact Us
          </Link>
          <p className="text-stone-500 pl-4">&copy; PrimeBid, LLC.</p>
          <p className="text-stone-500 pl-4">
            {" "}
            Designed By{" "}
            <Link
              to={"/"}
              className="font-semibold hover:text-accent hover:transition-all hover:duration-150"
            >
              Sai Kiran
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
