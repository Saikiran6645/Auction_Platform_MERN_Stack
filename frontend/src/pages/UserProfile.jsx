import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../custom-components/Spinner";

const UserProfile = () => {
  let { user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (user.success) {
      user = user.user;
    }
  }, [user]);

  const profile = user?.success ? user.user : user;

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#fff7f0] via-[#fde2c8] to-[#f6faff] py-12">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-white/90 backdrop-blur">
          {/* Sidebar */}
          <div className="bg-gradient-to-b from-[#d6482b] to-[#fbbf24] flex flex-col items-center justify-center py-12 px-8 md:w-1/3">
            <img
              src={profile?.profilePicture?.url || "/imageHolder.jpg"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-white"
            />
            <h2 className="text-2xl font-bold text-white mt-6 mb-2">
              {profile?.username}
            </h2>
            <span className="px-4 py-1 bg-white/20 text-white rounded-full shadow text-sm font-semibold uppercase tracking-wider mb-2">
              {profile?.role}
            </span>
            <p className="text-white/80 text-sm mt-2">
              Joined: {profile?.createdAt?.substring(0, 10)}
            </p>
          </div>
          {/* Details Card */}
          <div className="flex-1 p-8 bg-white">
            <h3 className="text-2xl font-bold text-[#d6482b] mb-6 border-b-2 border-[#fbbf24] pb-2">
              Profile Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Full Name" value={profile?.username} />
              <ProfileField label="Email" value={profile?.email} />
              <ProfileField label="Phone" value={profile?.phone} />
              <ProfileField label="Address" value={profile?.address} />
              <ProfileField label="Role" value={profile?.role} />
            </div>
            <div className="mt-10">
              {profile?.role === "Auctioneer" && (
                <>
                  <h4 className="text-xl font-semibold text-[#fbbf24] mb-4 mt-2">
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                      label="Bank Name"
                      value={profile?.paymentMethods?.bankTransfer?.bankName}
                    />
                    <ProfileField
                      label="Bank Account (IBAN)"
                      value={
                        profile?.paymentMethods?.bankTransfer?.bankAccountNumber
                      }
                    />
                    <ProfileField
                      label="Account Name"
                      value={
                        profile?.paymentMethods?.bankTransfer?.bankAccountName
                      }
                    />
                    <ProfileField
                      label="Paypal Email"
                      value={profile?.paymentMethods?.paypal?.paypalEmail}
                    />
                  </div>
                </>
              )}
              <h4 className="text-xl font-semibold text-[#fbbf24] mb-4 mt-10">
                Other User Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.role === "Auctioneer" && (
                  <ProfileField
                    label="Unpaid Commissions"
                    value={profile?.unpaidCommissions}
                  />
                )}
                {profile?.role === "Bidder" && (
                  <>
                    <ProfileField
                      label="Auctions Won"
                      value={profile?.auctionsWon}
                    />
                    <ProfileField
                      label="Money Spent"
                      value={profile?.moneySpent}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-500 mb-1">{label}</label>
    <div className="px-3 py-2 bg-[#fff7f0] border border-[#fde2c8] rounded-lg text-gray-900 font-medium min-h-[44px] flex items-center">
      {value || <span className="text-gray-400">—</span>}
    </div>
  </div>
);

export default UserProfile;
