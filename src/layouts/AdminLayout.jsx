import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import DashboardSidebar from "../features/admin-dashboard/components/DashboardSidebar";
import DashboardHeader from "../features/admin-dashboard/components/DashboardHeader";

const DASHBOARD_ROUTES = [
  "/admin/dashboard",
  "/admin/orders",
  "/admin/users",
  "/admin/vendors",
  "/admin/analytics",
  "/admin/notifications",
  "/admin/settings",
  "/admin/profile",
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDashboardRoute = DASHBOARD_ROUTES.some((route) => pathname.startsWith(route)) || pathname.startsWith("/admin/orders/");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (isDashboardRoute) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-charcoal-grey/3 via-white to-golden-amber/5">
        {/* Sidebar */}
        <DashboardSidebar isMobileOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Header */}
          <DashboardHeader onMenuClick={toggleSidebar} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Default layout for non-dashboard routes (if any)
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

