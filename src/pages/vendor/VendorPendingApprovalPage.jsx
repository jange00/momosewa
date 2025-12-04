import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiMail, FiCheckCircle, FiXCircle, FiLogOut } from "react-icons/fi";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import Logo from "../../common/Logo";
import { getVendorStatus, getVendorByEmail } from "../../utils/pendingVendors";
import { USER_ROLES } from "../../common/roleConstants";
import toast from "react-hot-toast";

const VendorPendingApprovalPage = () => {
  const navigate = useNavigate();
  const [vendorStatus, setVendorStatus] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");

      if (!email || role !== USER_ROLES.VENDOR) {
        navigate("/login");
        return;
      }

      const status = getVendorStatus(email);
      const vendor = getVendorByEmail(email);

      setVendorStatus(status);
      setVendorData(vendor);
      setIsChecking(false);

      // If approved, redirect to dashboard
      if (status === "active") {
        // Update localStorage to mark as approved
        localStorage.setItem("vendorApproved", "true");
        localStorage.setItem("vendorStatus", "active");
        toast.success("Your vendor account has been approved!");
        setTimeout(() => {
          navigate("/vendor/dashboard");
        }, 1500);
      }
    };

    checkStatus();
    
    // Check status every 5 seconds (for real-time updates)
    const interval = setInterval(checkStatus, 5000);
    
    // Listen for approval events
    const handleApproval = () => {
      checkStatus();
    };
    window.addEventListener("vendorApproved", handleApproval);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("vendorApproved", handleApproval);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("vendorId");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal-grey/3 via-white to-golden-amber/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-maroon mx-auto mb-4"></div>
          <p className="text-charcoal-grey/70">Checking approval status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal-grey/3 via-white to-golden-amber/5 p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="default" />
          </div>
          <h1 className="text-3xl font-black text-charcoal-grey mb-2">
            Vendor Application Status
          </h1>
        </div>

        {vendorStatus === "pending" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center mx-auto">
              <FiClock className="w-10 h-10 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-charcoal-grey mb-2">
                Application Under Review
              </h2>
              <p className="text-charcoal-grey/70 mb-4">
                Your vendor application is currently being reviewed by our admin team.
              </p>
            </div>

            {vendorData && (
              <div className="bg-charcoal-grey/5 rounded-xl p-6 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-charcoal-grey/60" />
                  <div>
                    <p className="text-xs text-charcoal-grey/60">Email</p>
                    <p className="font-semibold text-charcoal-grey">{vendorData.email}</p>
                  </div>
                </div>
                {vendorData.businessName && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-lg">🏪</span>
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-grey/60">Business Name</p>
                      <p className="font-semibold text-charcoal-grey">{vendorData.businessName}</p>
                    </div>
                  </div>
                )}
                {vendorData.applicationDate && (
                  <div className="flex items-center gap-3">
                    <FiClock className="w-5 h-5 text-charcoal-grey/60" />
                    <div>
                      <p className="text-xs text-charcoal-grey/60">Application Date</p>
                      <p className="font-semibold text-charcoal-grey">
                        {new Date(vendorData.applicationDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>What happens next?</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 text-left list-disc list-inside">
                <li>Our admin team will review your application</li>
                <li>You'll receive an email notification once approved</li>
                <li>This page will automatically update when your status changes</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="ghost" size="md" onClick={handleLogout}>
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  // Refresh status
                  const email = localStorage.getItem("email");
                  const status = getVendorStatus(email);
                  if (status === "active") {
                    navigate("/vendor/dashboard");
                  } else {
                    toast.info("Your application is still under review");
                  }
                }}
              >
                Check Status
              </Button>
            </div>
          </div>
        )}

        {vendorStatus === "rejected" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <FiXCircle className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-charcoal-grey mb-2">
                Application Rejected
              </h2>
              <p className="text-charcoal-grey/70 mb-4">
                Unfortunately, your vendor application has been rejected.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800">
                If you believe this is an error, please contact our support team for assistance.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="ghost" size="md" onClick={handleLogout}>
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="primary" size="md" onClick={() => navigate("/signup/vendor")}>
                Apply Again
              </Button>
            </div>
          </div>
        )}

        {vendorStatus === null && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-charcoal-grey/10 flex items-center justify-center mx-auto">
              <FiXCircle className="w-10 h-10 text-charcoal-grey/60" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-charcoal-grey mb-2">
                No Application Found
              </h2>
              <p className="text-charcoal-grey/70 mb-4">
                We couldn't find a vendor application for your account.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="ghost" size="md" onClick={handleLogout}>
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="primary" size="md" onClick={() => navigate("/signup/vendor")}>
                Apply as Vendor
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VendorPendingApprovalPage;

