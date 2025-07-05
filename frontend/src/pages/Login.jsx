import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchLeaderboard, login } from "../store/slices/userSlices";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    dispatch(login(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchLeaderboard());
      navigateTo("/");
    }
  }, [dispatch, isAuthenticated, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="w-full max-w-md bg-white/90 shadow-xl rounded-2xl px-8 py-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#d6482b] mb-2 tracking-tight drop-shadow-sm">
          Welcome Back
        </h1>
        <p className="text-gray-500 mb-8 text-base md:text-lg">
          Sign in to your account
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-stone-600 mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d6482b]">
                {/* Heroicon: Envelope */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 12l-4-4-4 4m8 0v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"
                  />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-orange-50 border border-orange-200 focus:border-[#d6482b] focus:ring-[#d6482b] transition-all duration-200 outline-none text-gray-800"
                placeholder="you@email.com"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-stone-600 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d6482b]">
                {/* Heroicon: Lock Closed */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m0 0a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v2a2 2 0 0 1-2 2zm0-6V7a4 4 0 0 1 8 0v4"
                  />
                </svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-orange-50 border border-orange-200 focus:border-[#d6482b] focus:ring-[#d6482b] transition-all duration-200 outline-none text-gray-800"
                placeholder="Your password"
              />
            </div>
            <div className="text-right mt-1">
              <button
                type="button"
                className="text-sm text-[#d6482b] hover:underline hover:text-[#b8381e] transition"
                onClick={() => alert("Forgot Password flow here!")}
              >
                Forgot password?
              </button>
            </div>
          </div>
          <button
            className="bg-[#d6482b] font-bold hover:bg-[#b8381e] transition-all duration-300 text-lg py-2 rounded-xl text-white shadow-lg mt-4"
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
                Logging In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-[#d6482b] font-medium hover:underline hover:text-[#b8381e] transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
