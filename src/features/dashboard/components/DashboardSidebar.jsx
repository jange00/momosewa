import { NavLink, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiPackage, 
  FiMapPin, 
  FiStar,
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState } from "react";
import Logo from "../../../common/Logo";

const DashboardSidebar = ({ isMobileOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get user name from localStorage or default
  const userName = localStorage.getItem("name") || "Customer";
  const userEmail = localStorage.getItem("email") || "";

  const menuItems = [
    { path: "/customer/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/customer/orders", label: "My Orders", icon: FiPackage },
    { path: "/customer/addresses", label: "Addresses", icon: FiMapPin },
    { path: "/customer/reviews", label: "My Reviews", icon: FiStar },
    { path: "/customer/notifications", label: "Notifications", icon: FiBell },
    { path: "/customer/profile", label: "Profile & Settings", icon: FiUser },
  ];

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Clear localStorage
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    // Redirect to login
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/98 backdrop-blur-xl border-r border-charcoal-grey/10 z-50 lg:z-auto transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-charcoal-grey/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Logo size="default" />
                <div className="flex flex-col">
                  <h1 className="text-xl font-black text-charcoal-grey leading-tight">
                    <span className="text-deep-maroon">Momo</span>Sewa
                  </h1>
                  <span className="text-xs text-charcoal-grey/60 font-medium">Customer Portal</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-charcoal-grey/5 text-charcoal-grey/60"
                aria-label="Close menu"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 rounded-xl p-4 border border-charcoal-grey/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-maroon to-golden-amber flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-charcoal-grey truncate">{userName}</p>
                  {userEmail && (
                    <p className="text-xs text-charcoal-grey/60 truncate">{userEmail}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-deep-maroon to-[#7a2533] text-white shadow-lg"
                          : "text-charcoal-grey/70 hover:bg-charcoal-grey/5 hover:text-deep-maroon"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-charcoal-grey/10 space-y-2">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
            >
              <FiLogOut className="w-5 h-5" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
            
            {/* Quick Link to Menu */}
            <NavLink
              to="/menu"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-deep-maroon via-[#7a2533] to-deep-maroon text-white font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span>🥟</span>
              <span>Order Now</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;

