import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiMail, FiCheckCircle, FiXCircle, FiLogOut } from "react-icons/fi";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import Logo from "../../common/Logo";
import { USER_ROLES } from "../../common/roleConstants";
import { useAuth } from "../../hooks/useAuth";
import { useGet } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../api/config";
import toast from "react-hot-toast";

const VendorPendingApprovalPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [vendorStatus, setVendorStatus] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const hasShownApprovalToast = useRef(false);
  const isApproved = useRef(false);

  // Determine which endpoint to use based on user role
  // Pending vendors (Customer role) should use /pending-approval
  // Approved vendors (Vendor role) should use /profile
  const isPendingVendor = user?.role === USER_ROLES.CUSTOMER;
  const isApprovedVendor = user?.role === USER_ROLES.VENDOR;

  // Fetch vendor approval status (for pending vendors who are still "Customer" role)
  const { data: vendorApprovalData, refetch: refetchApproval, error: approvalError } = useGet(
    'vendor-approval-status',
    `${API_ENDPOINTS.VENDORS}/pending-approval`,
    { 
      showErrorToast: false,
      ignore404: true, // Don't show toast for 404s (expected if vendor was approved)
      enabled: isAuthenticated && isPendingVendor && !isApproved.current,
      refetchInterval: (query) => {
        // Stop polling if approved
        if (isApproved.current) return false;
        return 20000; // Poll every 20 seconds (reduced frequency to avoid spam)
      },
      retry: false, // Don't retry - if it fails, we'll check the profile endpoint
      refetchOnWindowFocus: false, // Don't refetch on window focus
    }
  );

  // Fetch vendor profile (for approved vendors or to check if approved)
  const { data: vendorProfile, refetch: refetchProfile, error: profileError } = useGet(
    'vendor-profile',
    `${API_ENDPOINTS.VENDORS}/profile`,
    { 
      showErrorToast: false,
      ignore404: true, // Don't show toast for 404s (expected for pending vendors)
      enabled: isAuthenticated && !isApproved.current,
      refetchInterval: (query) => {
        // Stop polling if approved
        if (isApproved.current) return false;
        // Only poll if user is Vendor role (might be approved)
        if (isApprovedVendor) {
          return 20000; // Poll every 20 seconds
        }
        return false; // Don't poll if user is still Customer role
      },
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    // Check authentication
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    // Handle errors gracefully - don't show toasts for expected 404s
    // 404 on /profile is expected for pending vendors
    // 404 on /pending-approval might mean the vendor was approved (check /profile instead)
    if (approvalError && approvalError.response?.status !== 404) {
      // Only log non-404 errors, don't show toast
      console.warn("Error fetching vendor approval status:", approvalError);
    }
    if (profileError && profileError.response?.status !== 404) {
      // Only log non-404 errors, don't show toast
      console.warn("Error fetching vendor profile:", profileError);
    }

    // Get vendor status from approval status endpoint or vendor profile
    // According to backend: Pending vendors are "Customer" role, approved vendors are "Vendor" role
    const approvalData = vendorApprovalData?.data?.vendor || {};
    const profileData = vendorProfile?.data?.vendor || {};
    
    // Determine status - prioritize profile data if available (means vendor is approved)
    let status = profileData?.status || 
                 approvalData?.status ||
                 user?.status || 
                 user?.vendorStatus || 
                 user?.approvalStatus;

    // If user role is Vendor, they're approved
    if (user?.role === USER_ROLES.VENDOR && !status) {
      status = "active";
    }

    // Default to pending if no status found
    if (!status) {
      status = "pending";
    }

    setVendorStatus(status);

    // Set vendor data from approval status, profile, or user object
    const vendorData = profileData || approvalData || {};
    setVendorData({
      email: user?.email || vendorData.email,
      businessName: vendorData.businessName || user?.businessName,
      storeName: vendorData.storeName || user?.storeName,
      applicationDate: vendorData.applicationDate || vendorData.createdAt || user?.createdAt,
      ...vendorData,
    });

    // If approved and user role is now "Vendor", redirect to dashboard
    // Only show toast once and redirect once
    if ((status === "active" || status === "approved") && user?.role === USER_ROLES.VENDOR) {
      if (!isApproved.current && !hasShownApprovalToast.current) {
        isApproved.current = true;
        hasShownApprovalToast.current = true;
        // Use a unique toast ID to prevent duplicates
        toast.success("Your vendor account has been approved!", { 
          duration: 3000,
          id: 'vendor-approved', // Unique ID prevents duplicate toasts
        });
        setTimeout(() => {
          navigate("/vendor/dashboard", { replace: true });
        }, 1500);
      }
    }
  }, [user, vendorApprovalData, vendorProfile, isAuthenticated, authLoading, navigate, approvalError, profileError]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (authLoading || !vendorStatus) {
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
                onClick={async () => {
                  try {
                    // Refresh status from API
                    if (isPendingVendor) {
                      await refetchApproval();
                    }
                    if (isApprovedVendor || !isPendingVendor) {
                      await refetchProfile();
                    }
                    
                    // Wait a bit for state to update
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    const approvalData = vendorApprovalData?.data?.vendor || {};
                    const profileData = vendorProfile?.data?.vendor || {};
                    const status = profileData?.status || approvalData?.status;
                    
                    // Check if user role has changed to Vendor (approved)
                    if (user?.role === USER_ROLES.VENDOR || status === "active" || status === "approved") {
                      if (!hasShownApprovalToast.current) {
                        hasShownApprovalToast.current = true;
                        toast.success("Your account has been approved!", { 
                          duration: 3000,
                          id: 'vendor-approved-manual', // Unique ID prevents duplicates
                        });
                      }
                      setTimeout(() => {
                        navigate("/vendor/dashboard");
                      }, 1000);
                    } else {
                      toast.info("Your application is still under review", { 
                        duration: 2000,
                        id: 'vendor-pending-status', // Unique ID prevents duplicates
                      });
                    }
                  } catch (error) {
                    // Silently handle errors - don't show toast for expected 404s
                    console.log("Status check:", error.response?.status === 404 ? "Not found (expected)" : error.message);
                    toast.info("Your application is still under review", { duration: 2000 });
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

