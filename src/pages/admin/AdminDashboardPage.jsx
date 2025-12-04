import DashboardWelcome from "../../features/admin-dashboard/components/DashboardWelcome";
import DashboardStats from "../../features/admin-dashboard/components/DashboardStats";
import DashboardQuickActions from "../../features/admin-dashboard/components/DashboardQuickActions";
import DashboardRecentOrders from "../../features/admin-dashboard/components/DashboardRecentOrders";

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

const AdminDashboardPage = () => {
  const userName = localStorage.getItem("name") || "Admin";

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardWelcome userName={userName} />
        <DashboardStats stats={mockStats} />
        <DashboardQuickActions />
        <DashboardRecentOrders orders={mockRecentOrders} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;

