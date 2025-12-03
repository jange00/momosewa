import DashboardWelcome from "../../features/customer-dashboard/components/DashboardWelcome";
import DashboardStats from "../../features/customer-dashboard/components/DashboardStats";
import DashboardQuickActions from "../../features/customer-dashboard/components/DashboardQuickActions";
import DashboardRecentOrders from "../../features/customer-dashboard/components/DashboardRecentOrders";
import DashboardOffers from "../../features/customer-dashboard/components/DashboardOffers";

// Mock data - replace with actual API calls
const mockStats = {
  totalOrders: 24,
  activeOrders: 2,
  totalSpent: 12500,
};

const mockRecentOrders = [
  {
    id: "ORD-12345",
    date: "Jan 15, 2024 - 02:30 PM",
    status: "on-the-way",
    total: 550.00,
    itemsCount: 3,
    items: [
      { name: "Steam Momo (10 pcs)", quantity: 2, price: 500, emoji: "🥟" },
      { name: "Jhol Momo (10 pcs)", quantity: 1, price: 300, emoji: "🥟" },
    ],
  },
  {
    id: "ORD-12344",
    date: "Jan 14, 2024 - 08:15 PM",
    status: "delivered",
    total: 720.00,
    itemsCount: 2,
    items: [
      { name: "Fried Momo (8 pcs)", quantity: 2, price: 560, emoji: "🥟" },
      { name: "C-Momo (1 plate)", quantity: 1, price: 320, emoji: "🥟" },
    ],
  },
  {
    id: "ORD-12343",
    date: "Jan 14, 2024 - 01:45 PM",
    status: "delivered",
    total: 600.00,
    itemsCount: 2,
    items: [
      { name: "Chicken Momo (10 pcs)", quantity: 2, price: 520, emoji: "🥟" },
      { name: "Veg Momo (10 pcs)", quantity: 1, price: 220, emoji: "🥟" },
    ],
  },
];

const CustomerDashboardPage = () => {
  const userName = localStorage.getItem("name") || "Customer";

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardWelcome userName={userName} />
        <DashboardStats stats={mockStats} />
        <DashboardQuickActions />
        <DashboardRecentOrders orders={mockRecentOrders} />
        <DashboardOffers />
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
