import { useState } from "react";
import toast from "react-hot-toast";
import DashboardWelcome from "../../features/vendor-dashboard/components/DashboardWelcome";
import DashboardStats from "../../features/vendor-dashboard/components/DashboardStats";
import DashboardQuickActions from "../../features/vendor-dashboard/components/DashboardQuickActions";
import DashboardRecentOrders from "../../features/vendor-dashboard/components/DashboardRecentOrders";
import { getVendorData } from "../../utils/vendorData";

// Mock data - replace with actual API calls
const mockStats = {
  totalOrders: 156,
  activeOrders: 8,
  totalRevenue: 245000,
  todayRevenue: 12500,
  ordersTrend: 18,
  revenueTrend: 22,
  todayTrend: 15,
};

const mockRecentOrders = [
  {
    id: "ORD-12345",
    date: "Jan 15, 2024 - 02:30 PM",
    status: "pending",
    total: 550.00,
    itemsCount: 3,
    items: [
      { name: "Steam Momo (10 pcs)", quantity: 2, price: 500, emoji: "🥟" },
      { name: "Jhol Momo (10 pcs)", quantity: 1, price: 300, emoji: "🥟" },
    ],
    customer: {
      name: "Ram Bahadur",
      phone: "+977 9801234567",
      address: "123 Main Street, Thamel, Kathmandu 44600",
    },
  },
  {
    id: "ORD-12344",
    date: "Jan 15, 2024 - 02:15 PM",
    status: "preparing",
    total: 720.00,
    itemsCount: 2,
    items: [
      { name: "Fried Momo (8 pcs)", quantity: 2, price: 560, emoji: "🥟" },
      { name: "C-Momo (1 plate)", quantity: 1, price: 320, emoji: "🥟" },
    ],
    customer: {
      name: "Sita Kumari",
      phone: "+977 9812345678",
      address: "456 Business Park, Durbar Marg, Kathmandu 44600",
    },
  },
  {
    id: "ORD-12343",
    date: "Jan 15, 2024 - 01:45 PM",
    status: "on-the-way",
    total: 600.00,
    itemsCount: 2,
    items: [
      { name: "Chicken Momo (10 pcs)", quantity: 2, price: 520, emoji: "🥟" },
      { name: "Veg Momo (10 pcs)", quantity: 1, price: 220, emoji: "🥟" },
    ],
    customer: {
      name: "Hari Prasad",
      phone: "+977 9823456789",
      address: "789 Residential Area, New Baneshwor, Kathmandu 44600",
    },
  },
];

const VendorDashboardPage = () => {
  const vendorData = getVendorData();
  const userName = vendorData.name || vendorData.businessName || "Vendor";
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders);
  
  // Handle order status updates
  const handleStatusUpdate = (orderId, newStatus) => {
    // Update local state
    setRecentOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    const statusMessages = {
      pending: "Order marked as pending",
      preparing: "Order accepted! Start preparing now.",
      "on-the-way": "Order marked as ready for delivery",
      delivered: "Order marked as delivered!",
      cancelled: "Order cancelled",
    };
    
    toast.success(statusMessages[newStatus] || `Order status updated to ${newStatus}`);
    
    // TODO: Replace with actual API call
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardWelcome userName={userName} />
        <DashboardStats stats={mockStats} />
        <DashboardQuickActions />
        <DashboardRecentOrders orders={recentOrders} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  );
};

export default VendorDashboardPage;

