import React, { useState, useEffect } from "react";
import { RiAuctionFill, RiInstagramFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard } from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook, FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaFileInvoiceDollar, FaEye } from "react-icons/fa6";
import { logout } from "../store/slices/userSlices";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user, role } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Prevent background scroll when drawer is open (mobile only)
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setShow(true)}
        className="fixed top-5 right-5 z-40 rounded-md p-3 bg-[#d6482b] text-white hover:bg-[#b8381e] lg:hidden shadow-md transition"
        aria-label="Open Menu"
      >
        <GiHamburgerMenu size={24} />
      </button>

      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ${
          show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } lg:hidden`}
        onClick={() => setShow(false)}
        aria-hidden="true"
      />

      {/* Side Drawer */}
      <nav
        className={`fixed top-0 left-0 z-50 h-full w-[88vw] max-w-[340px] bg-white/80 backdrop-blur-xl shadow-2xl border-r border-[#e3e1e8]
        transition-transform duration-300 flex flex-col justify-between
        ${show ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:w-[300px] lg:block`}
      >
        <div className="relative px-7 pt-8 pb-4 flex-1 flex flex-col">
          {/* Close Button for mobile */}
          <button
            className="absolute top-3 right-3 text-[#d6482b] bg-white/70 rounded-full p-1 shadow-md lg:hidden"
            onClick={() => setShow(false)}
            aria-label="Close Menu"
          >
            <IoMdCloseCircleOutline size={28} />
          </button>
          {/* Logo */}
          <Link to="/" onClick={() => setShow(false)}>
            <h4 className="text-3xl font-extrabold mb-7 tracking-tight text-[#332e42]">
              Prime<span className="text-[#d6482b]">Bid</span>
            </h4>
          </Link>
          {/* Nav Links */}
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to="/auctions"
                onClick={() => setShow(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
              >
                <RiAuctionFill size={22} /> Auctions
              </Link>
            </li>
            <li>
              <Link
                to="/leaderboard"
                onClick={() => setShow(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
              >
                <MdLeaderboard size={22} /> LeaderBoard
              </Link>
            </li>
            {isAuthenticated && user && role === "Auctioneer" && (
              <>
                <li>
                  <Link
                    to="/submitcommission"
                    onClick={() => setShow(false)}
                    className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
                  >
                    <FaFileInvoiceDollar size={20} /> Submit Commission
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-auction"
                    onClick={() => setShow(false)}
                    className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
                  >
                    <IoIosCreate size={22} /> Create Auction
                  </Link>
                </li>
                <li>
                  <Link
                    to="/view-my-auctions"
                    onClick={() => setShow(false)}
                    className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
                  >
                    <FaEye size={20} /> View My Auctions
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && user && role === "Super Admin" && (
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setShow(false)}
                  className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
                >
                  <MdDashboard size={20} /> Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Auth Buttons */}
          <div className="mt-7 mb-4 flex gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  onClick={() => setShow(false)}
                  className="bg-[#d6482b] font-bold text-white hover:bg-[#b8381e] px-5 py-2 rounded-lg transition text-base shadow"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  onClick={() => setShow(false)}
                  className="border-2 border-[#d6482b] font-bold text-[#d6482b] bg-white px-5 py-2 rounded-lg hover:bg-[#f9e6e0] hover:text-[#b8381e] transition text-base shadow"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                className="bg-[#d6482b] font-bold text-white hover:bg-[#b8381e] px-5 py-2 rounded-lg transition text-base shadow"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
          <hr className="mb-4 border-t-[#e3e1e8]" />
          <ul className="flex flex-col gap-3">
            {isAuthenticated && (
              <li>
                <Link
                  to="/me"
                  onClick={() => setShow(false)}
                  className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
                >
                  <FaUserCircle size={20} /> Profile
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/howitworks"
                onClick={() => setShow(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
              >
                <SiGooglesearchconsole size={20} /> How it works
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setShow(false)}
                className="flex items-center gap-3 text-lg font-semibold text-[#332e42] hover:text-[#d6482b] transition"
              >
                <BsFillInfoSquareFill size={20} /> About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="px-7 pb-6">
          <div className="flex gap-4 mb-3">
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-stone-500 p-2 rounded-full hover:text-blue-700 shadow hover:scale-110 transition"
              aria-label="Facebook"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-stone-500 p-2 rounded-full hover:text-pink-700 shadow hover:scale-110 transition"
              aria-label="Instagram"
            >
              <RiInstagramFill size={18} />
            </a>
          </div>
          {/* <Link
            to="/contact"
            onClick={() => setShow(false)}
            className="block text-stone-600 font-semibold hover:text-[#d6482b] transition mb-1"
          >
            Contact Us
          </Link> */}
          <div className="text-xs text-stone-500 mb-1">
            &copy; PrimeBid, LLC.
          </div>
          <div className="text-xs text-stone-500">
            Designed By{" "}
            <Link
              to="/"
              className="font-semibold hover:text-[#d6482b] transition"
              onClick={() => setShow(false)}
            >
              Sai Kiran
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideDrawer;
