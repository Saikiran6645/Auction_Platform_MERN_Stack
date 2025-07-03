import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../store/slices/userSlices";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  
  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("profilePhoto", profileImage);
    if (role === "Auctioneer") {
      formData.append("bankAccountName", bankAccountName);
      formData.append("bankAccountNumber", bankAccountNumber);
      formData.append("bankName", bankName);
      formData.append("paypalEmail", paypalEmail);
    }

    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, loading, isAuthenticated]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(file);
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-3">
      <div className="w-full max-w-2xl bg-white/90 shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center backdrop-blur">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#d6482b] mb-2 tracking-tight drop-shadow-sm">
          Register
        </h1>
        <p className="text-gray-500 mb-8 text-base md:text-lg">
          Create an account to join auctions and start bidding!
        </p>
        <form className="flex flex-col gap-7 w-full" onSubmit={handleRegister}>
          {/* Personal Details */}
          <div>
            <h2 className="font-semibold text-xl md:text-2xl mb-3 text-[#d6482b]">
              Personal Details
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col md:flex-1">
                <label className="text-[16px] text-stone-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-1">
                <label className="text-[16px] text-stone-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex flex-col md:flex-1">
                <label className="text-[16px] text-stone-600 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800"
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-1">
                <label className="text-[16px] text-stone-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800"
                  placeholder="Address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role & Password */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col md:flex-1">
              <label className="text-[16px] text-stone-600 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800"
                required
              >
                <option value="">Select Role</option>
                <option value="Auctioneer">Auctioneer</option>
                <option value="Bidder">Bidder</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-1">
              <label className="text-[16px] text-stone-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800"
                placeholder="Password"
                required
              />
            </div>
          </div>

          {/* Profile image */}
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-stone-600 mb-1">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <img
                src={profileImagePreview || "/imageHolder.jpg"}
                alt="profile"
                className="w-16 h-16 rounded-full border-2 border-orange-200 object-cover shadow"
              />
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-orange-50 file:text-[#d6482b]
                            hover:file:bg-orange-100 transition"
                  onChange={imageHandler}
                />
              </label>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="font-semibold text-xl md:text-2xl mb-2 text-[#d6482b]">
              Payment Method Details
            </h2>
            <p className="text-[12px] text-stone-500 mb-3">
              Fill payment details only if registering as an{" "}
              <span className="font-semibold text-[#d6482b]">Auctioneer</span>
            </p>
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-stone-500">Bank Details</label>
              <div className="flex flex-col md:flex-wrap gap-3">
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={`rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800 md:flex-1 ${
                    role === "Bidder" && "opacity-50 pointer-events-none"
                  }`}
                  disabled={role === "Bidder"}
                >
                  <option value="">Select Your Bank</option>
                  <option value="State Bank of India">
                    State Bank of India (SBI)
                  </option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Punjab National Bank">
                    Punjab National Bank (PNB)
                  </option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                  <option value="Canara Bank">Canara Bank</option>
                  <option value="Kotak Mahindra Bank">
                    Kotak Mahindra Bank
                  </option>
                  <option value="IndusInd Bank">IndusInd Bank</option>
                  <option value="Union Bank of India">
                    Union Bank of India
                  </option>
                  <option value="IDBI Bank">IDBI Bank</option>
                  <option value="Yes Bank">Yes Bank</option>
                  <option value="Indian Bank">Indian Bank</option>
                  <option value="Central Bank of India">
                    Central Bank of India
                  </option>
                  <option value="Bank of India">Bank of India</option>
                </select>
                <input
                  type="text"
                  value={bankAccountNumber}
                  placeholder="IBAN / IFSC"
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className={`rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800 md:flex-1 ${
                    role === "Bidder" && "opacity-50 pointer-events-none"
                  }`}
                  disabled={role === "Bidder"}
                />
                <input
                  type="text"
                  value={bankAccountName}
                  placeholder="Bank Account UserName"
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className={`rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800 md:flex-1 ${
                    role === "Bidder" && "opacity-50 pointer-events-none"
                  }`}
                  disabled={role === "Bidder"}
                />
              </div>
              <div>
                <label className="text-[16px] text-stone-600 font-semibold">
                  Paypal Details
                </label>
                <input
                  type="email"
                  value={paypalEmail}
                  placeholder="Paypal Email"
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className={`rounded-lg px-4 py-2 border border-orange-200 bg-orange-50 focus:border-[#d6482b] focus:ring-2 focus:ring-[#ffd3bb] outline-none transition-all duration-150 text-gray-800 w-full mt-2 ${
                    role === "Bidder" && "opacity-50 pointer-events-none"
                  }`}
                  disabled={role === "Bidder"}
                />
              </div>
            </div>
          </div>

          <button
            className="bg-[#d6482b] w-full font-bold hover:bg-[#b8381e] transition-all duration-300 text-lg py-3 rounded-xl text-white shadow-lg mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#d6482b] font-medium hover:underline hover:text-[#b8381e] transition"
          >
            login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
