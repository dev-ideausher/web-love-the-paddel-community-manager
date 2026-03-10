import React from "react";
import { sendPasswordResetLink } from "@/services/profileServices";
import { toast } from "react-toastify";
import { auth } from "@/services/firebase-services/firebase";
import { getCommunityDashboard } from "@/services/api/transactions";

const Field = ({ label, children }) => (
  <div className="flex flex-col pt-4 space-y-1">
    <label className="text-sm font-medium text-gray-900">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
  </div>
);

const SettingsPanel = () => {
  const inputStyle =
    "w-full px-4 py-3 max-w-md bg-[#F5F7F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition";
  const [communityName, setCommunityName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDataLoading, setIsDataLoading] = React.useState(true);

  React.useEffect(() => {
    setIsDataLoading(true);
    
    // Wait for auth to be ready
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setEmail(user.email || "");
        
        try {
          const response = await getCommunityDashboard();
          if (response.status && response.data?.community?.name) {
            setCommunityName(response.data.community.name);
          }
        } catch (error) {
          console.error("Failed to fetch community data:", error);
        }
      }
      setIsDataLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSendResetLink = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetLink(email);
    } catch (error) {
      console.error('Reset link error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4 p-6 m-4 bg-white rounded-2xl">
        <span className="text-xl font-medium">Profile Details</span>
        <div>
          <Field label="Community Name">
            <input
              value={isDataLoading ? "Loading..." : communityName}
              disabled
              className={inputStyle}
              placeholder="Love the Padel"
            />
          </Field>
          <Field label="Email Address">
            <input
              value={isDataLoading ? "Loading..." : email}
              disabled
              className={inputStyle}
              placeholder="No email"
            />
          </Field>
          <button className="px-6 py-3 mt-4 text-sm font-medium text-white transition bg-black rounded-xl hover:bg-black/80">
            Save Changes
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full gap-4 p-6 m-4 bg-white rounded-2xl">
        <span className="text-xl font-medium">Change Password</span>
        <div>
          <span className="text-sm font-normal text-[#5D5D5D]">
            Enter your registered email ID below. We will send a password reset
            link to your registered email ID.
          </span>
          <Field label="Email Address">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              placeholder="Enter email address"
            />
          </Field>
          <button 
            onClick={handleSendResetLink}
            disabled={isLoading}
            className="px-6 py-3 mt-4 text-sm font-medium text-white transition bg-black rounded-xl hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
