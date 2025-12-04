import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import LoginPromo from "../features/auth/components/login/LoginPromo";
import LoginForm from "../features/auth/components/login/LoginForm";
import Footer from "../features/landing/components/Footer";
import { ROLE_DASHBOARD_ROUTES, USER_ROLES } from "../common/roleConstants";
import { getVendorStatus } from "../utils/pendingVendors";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or Phone is required";
    } else if (
      !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.emailOrPhone) &&
      !/^\+?[\d\s-()]{10,}$/.test(formData.emailOrPhone)
    ) {
      newErrors.emailOrPhone = "Please enter a valid email or phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - In real app, API will return user role and token
    setTimeout(() => {
      console.log("Login attempt:", formData);
      
      // TODO: In production, replace this with actual API call
      // const response = await api.post('/auth/login', formData);
      // const { user, token, role } = response.data;
      // localStorage.setItem('token', token);
      // localStorage.setItem('role', role);
      
      // Get role from localStorage (in real app, this comes from API response)
      const userRole = localStorage.getItem("role");
      const userEmail = localStorage.getItem("email");
      
      setIsLoading(false);
      
      // Check vendor approval status
      if (userRole === USER_ROLES.VENDOR && userEmail) {
        const vendorStatus = getVendorStatus(userEmail);
        
        if (vendorStatus === "pending") {
          toast.info("Your vendor application is pending approval");
          navigate("/vendor/pending-approval");
          return;
        } else if (vendorStatus === "rejected") {
          toast.error("Your vendor application has been rejected");
          navigate("/vendor/pending-approval");
          return;
        } else if (vendorStatus !== "active") {
          toast.error("Your vendor account is not active");
          navigate("/vendor/pending-approval");
          return;
        }
      }
      
      // For customers, stay on landing page (navbar will show user menu)
      // For other roles, redirect to their dashboard
      if (userRole === USER_ROLES.CUSTOMER) {
        navigate("/"); // Stay on landing page
      } else if (userRole && ROLE_DASHBOARD_ROUTES[userRole]) {
        navigate(ROLE_DASHBOARD_ROUTES[userRole]);
      } else {
        // Default to landing page if no role is set
        navigate("/");
      }
    }, 1000);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      
      // TODO: In production, send token to backend to get user role
      // const response = await api.post('/auth/google', { token: tokenResponse.access_token });
      // const { user, token, role } = response.data;
      // localStorage.setItem('token', token);
      // localStorage.setItem('role', role);
      
      // For now, get role from localStorage
      // In production, role should come from API response
      const userRole = localStorage.getItem("role");
      const userEmail = localStorage.getItem("email");
      
      // Check vendor approval status
      if (userRole === USER_ROLES.VENDOR && userEmail) {
        const vendorStatus = getVendorStatus(userEmail);
        
        if (vendorStatus === "pending") {
          toast.info("Your vendor application is pending approval");
          navigate("/vendor/pending-approval");
          return;
        } else if (vendorStatus === "rejected") {
          toast.error("Your vendor application has been rejected");
          navigate("/vendor/pending-approval");
          return;
        } else if (vendorStatus !== "active") {
          toast.error("Your vendor account is not active");
          navigate("/vendor/pending-approval");
          return;
        }
      }
      
      // For customers, stay on landing page (navbar will show user menu)
      // For other roles, redirect to their dashboard
      if (userRole === USER_ROLES.CUSTOMER) {
        navigate("/"); // Stay on landing page
      } else if (userRole && ROLE_DASHBOARD_ROUTES[userRole]) {
        navigate(ROLE_DASHBOARD_ROUTES[userRole]);
      } else {
        // No role found - might need to complete profile or select role
        navigate("/");
      }
    },
    onError: () => {
      console.error("Google login failed");
      // TODO: Show error toast/notification to user
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-grey/5 via-white to-golden-amber/5 flex flex-col relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-deep-maroon/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-golden-amber/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Professional Container */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-charcoal-grey/10">
            {/* Left Section - Promotional */}
            <LoginPromo />

            {/* Right Section - Login Form */}
            <LoginForm
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleGoogleLogin={handleGoogleLogin}
            />
          </div>
        </div>
      </div>

      {/* Footer Below */}
      <Footer />
    </div>
  );
};

export default LoginPage;

