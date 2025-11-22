import { FiPackage, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { FiShoppingBag, FiMapPin } from "react-icons/fi";
import StatCard from "../../features/dashboard/components/StatCard";
import QuickActionCard from "../../features/dashboard/components/QuickActionCard";
import RecentOrderCard from "../../features/dashboard/components/RecentOrderCard";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import { Link } from "react-router-dom";

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
  // Get user name from localStorage
  const userName = localStorage.getItem("name") || "Customer";

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey">
            {getGreeting()}, {userName.split(" ")[0]}! 👋
          </h1>
          <p className="text-charcoal-grey/70 text-lg">
            Welcome back to your MomoSewa dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Orders"
            value={mockStats.totalOrders}
            trend={12}
            icon={FiPackage}
          />
          <StatCard
            title="Active Orders"
            value={mockStats.activeOrders}
            icon={FiShoppingBag}
          />
          <StatCard
            title="Total Spent"
            value={`Rs. ${mockStats.totalSpent.toLocaleString()}`}
            trend={8}
            icon={FiDollarSign}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-charcoal-grey">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <QuickActionCard
              icon={FiShoppingBag}
              title="Order Now"
              description="Browse menu"
              to="/menu"
            />
            <QuickActionCard
              icon={FiPackage}
              title="Track Order"
              description="View active orders"
              to="/customer/orders"
            />
            <QuickActionCard
              icon={FiMapPin}
              title="Addresses"
              description="Manage addresses"
              to="/customer/addresses"
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-charcoal-grey">Recent Orders</h2>
            <Link to="/customer/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockRecentOrders.map((order) => (
              <RecentOrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Recommendations / Offers */}
        <div>
          <h2 className="text-2xl font-black text-charcoal-grey mb-6">
            Special Offers
          </h2>
          <Card className="p-6 bg-gradient-to-r from-deep-maroon/10 via-golden-amber/10 to-deep-maroon/10 border-2 border-golden-amber/30">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎉</div>
              <div className="flex-1">
                <h3 className="font-bold text-charcoal-grey text-lg mb-1">
                  Weekend Special Discount!
                </h3>
                <p className="text-charcoal-grey/70 mb-3">
                  Get 15% off on all orders above Rs. 500. Use code: WEEKEND15
                </p>
                <Link to="/menu">
                  <Button variant="primary" size="sm">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;

