import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import NotFound from "../components/NotFound/NotFound";
import ProtectedRoute from "./roleGuard";
import AdminLayout from "../layouts/AdminLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import VendorLayout from "../layouts/VendorLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import CustomerSignupPage from "../pages/CustomerSignupPage";
import VendorSignupPage from "../pages/VendorSignupPage";
import AdminSignupPage from "../pages/AdminSignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import { USER_ROLES } from "../common/roleConstants";
import MenuPage from "../pages/MenuPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";

// Customer Dashboard Pages
import CustomerDashboardPage from "../pages/customer/CustomerDashboardPage";
import CustomerOrdersPage from "../pages/customer/CustomerOrdersPage";
import CustomerAddressesPage from "../pages/customer/CustomerAddressesPage";
import CustomerReviewsPage from "../pages/customer/CustomerReviewsPage";
import CustomerNotificationsPage from "../pages/customer/CustomerNotificationsPage";
import CustomerProfilePage from "../pages/customer/CustomerProfilePage";


const VendorDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
    <p className="mt-4 text-gray-600">Welcome to your vendor dashboard!</p>
  </div>
);

const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    <p className="mt-4 text-gray-600">Welcome to admin dashboard!</p>
  </div>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/sign-in",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <RoleSelectionPage />,
      },
      {
        path: "/register",
        element: <RoleSelectionPage />,
      },
      {
        path: "/signup/customer",
        element: <CustomerSignupPage />,
      },
      {
        path: "/signup/vendor",
        element: <VendorSignupPage />,
      },
       {
        path: "/menu",
        element: <MenuPage />,
      },
      {
        path: "/signup/admin",
        element: <AdminSignupPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
    ],
  },
  // Customer Protected Routes
  {
    element: (
      <ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/customer/dashboard",
        element: <CustomerDashboardPage />,
      },
      {
        path: "/customer/orders",
        element: <CustomerOrdersPage />,
      },
      {
        path: "/customer/addresses",
        element: <CustomerAddressesPage />,
      },
      {
        path: "/customer/reviews",
        element: <CustomerReviewsPage />,
      },
      {
        path: "/customer/notifications",
        element: <CustomerNotificationsPage />,
      },
      {
        path: "/customer/profile",
        element: <CustomerProfilePage />,
      },
    ],
  },
  // Vendor Protected Routes
  {
    element: (
      <ProtectedRoute requiredRole={USER_ROLES.VENDOR}>
        <VendorLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/vendor/dashboard",
        element: <VendorDashboard />,
      },
    ],
  },
  // Admin Protected Routes
  {
    element: (
      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
]);
