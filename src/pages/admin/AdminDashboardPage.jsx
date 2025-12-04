import { useState } from "react";
import DashboardWelcome from "../../features/admin-dashboard/components/DashboardWelcome";
import DashboardStats from "../../features/admin-dashboard/components/DashboardStats";
import DashboardQuickActions from "../../features/admin-dashboard/components/DashboardQuickActions";
import DashboardRecentOrders from "../../features/admin-dashboard/components/DashboardRecentOrders";
import Card from "../../ui/cards/Card";
import { FiTrendingUp, FiActivity, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

// Mock data - replace with actual API calls
const mockStats = {
  totalOrders: 1245,
  ordersTrend: 15,
  totalUsers: 3420,
  usersTrend: 12,
  totalVendors: 156,
  vendorsTrend: 8,
  totalRevenue: 2450000,
  revenueTrend: 22,
};

const mockRecentOrders = [
  {
    id: "ORD-12345",
    date: "Jan 15, 2024 - 02:30 PM",
    status: "on-the-way",
    total: 550.00,
    itemsCount: 3,
    customer: {
      name: "Ram Bahadur",
      email: "ram.bahadur@example.com",
      phone: "+977 9801234567",
    },
    vendor: {
      name: "Momo House",
      businessName: "Momo House Restaurant",
    },
    items: [
      { name: "Steam Momo (10 pcs)", quantity: 2, price: 500, emoji: "🥟" },
      { name: "Jhol Momo (10 pcs)", quantity: 1, price: 300, emoji: "🥟" },
    ],
  },
  {
    id: "ORD-12344",
    date: "Jan 15, 2024 - 02:15 PM",
    status: "delivered",
    total: 720.00,
    itemsCount: 2,
    customer: {
      name: "Sita Kumari",
      email: "sita.kumari@example.com",
      phone: "+977 9812345678",
    },
    vendor: {
      name: "Delicious Momos",
      businessName: "Delicious Momos & More",
    },
    items: [
      { name: "Fried Momo (8 pcs)", quantity: 2, price: 560, emoji: "🥟" },
      { name: "C-Momo (1 plate)", quantity: 1, price: 320, emoji: "🥟" },
    ],
  },
  {
    id: "ORD-12343",
    date: "Jan 15, 2024 - 01:45 PM",
    status: "delivered",
    total: 600.00,
    itemsCount: 2,
    customer: {
      name: "Hari Prasad",
      email: "hari.prasad@example.com",
      phone: "+977 9823456789",
    },
    vendor: {
      name: "Momo House",
      businessName: "Momo House Restaurant",
    },
    items: [
      { name: "Chicken Momo (10 pcs)", quantity: 2, price: 520, emoji: "🥟" },
      { name: "Veg Momo (10 pcs)", quantity: 1, price: 220, emoji: "🥟" },
    ],
  },
];

const mockActivity = [
  { type: "order", message: "New order #ORD-12345 placed", time: "2 min ago", status: "success" },
  { type: "user", message: "New customer registered", time: "15 min ago", status: "success" },
  { type: "vendor", message: "Vendor application pending review", time: "1 hour ago", status: "warning" },
  { type: "order", message: "Order #ORD-12344 delivered", time: "2 hours ago", status: "success" },
];

const AdminDashboardPage = () => {
  const userName = localStorage.getItem("name") || "Admin";

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardWelcome userName={userName} />
        <DashboardStats stats={mockStats} />
        <DashboardQuickActions />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <DashboardRecentOrders orders={mockRecentOrders} />
          </div>
          
          {/* Activity Feed */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-charcoal-grey">Activity Feed</h2>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                {mockActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-charcoal-grey/10 last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.status === "success" 
                        ? "bg-green-50 text-green-600" 
                        : activity.status === "warning"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {activity.status === "success" ? (
                        <FiCheckCircle className="w-4 h-4" />
                      ) : (
                        <FiAlertCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal-grey">{activity.message}</p>
                      <p className="text-xs text-charcoal-grey/50 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

