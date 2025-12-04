import Card from "../../ui/cards/Card";
import { FiTrendingUp, FiUsers, FiShoppingBag, FiPackage, FiCreditCard } from "react-icons/fi";

// Mock data - replace with actual API calls
const mockAnalytics = {
  overview: {
    totalRevenue: 2450000,
    revenueGrowth: 22,
    totalOrders: 1245,
    ordersGrowth: 15,
    totalUsers: 3420,
    usersGrowth: 12,
    totalVendors: 156,
    vendorsGrowth: 8,
  },
  recentActivity: [
    { type: "order", description: "New order #ORD-12345", time: "2 minutes ago" },
    { type: "user", description: "New user registered", time: "15 minutes ago" },
    { type: "vendor", description: "New vendor joined", time: "1 hour ago" },
    { type: "order", description: "Order #ORD-12344 delivered", time: "2 hours ago" },
  ],
};

const AdminAnalyticsPage = () => {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-charcoal-grey">Platform Analytics</h1>
          <p className="text-charcoal-grey/70 mt-1">Comprehensive insights into platform performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-deep-maroon" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-600">
                <FiTrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">{mockAnalytics.overview.revenueGrowth}%</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-charcoal-grey/60 mb-1">Total Revenue</h3>
            <p className="text-2xl font-black text-charcoal-grey">
              Rs. {mockAnalytics.overview.totalRevenue.toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-deep-maroon" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-600">
                <FiTrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">{mockAnalytics.overview.ordersGrowth}%</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-charcoal-grey/60 mb-1">Total Orders</h3>
            <p className="text-2xl font-black text-charcoal-grey">{mockAnalytics.overview.totalOrders}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-deep-maroon" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-600">
                <FiTrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">{mockAnalytics.overview.usersGrowth}%</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-charcoal-grey/60 mb-1">Total Users</h3>
            <p className="text-2xl font-black text-charcoal-grey">{mockAnalytics.overview.totalUsers}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                <FiShoppingBag className="w-6 h-6 text-deep-maroon" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-600">
                <FiTrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">{mockAnalytics.overview.vendorsGrowth}%</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-charcoal-grey/60 mb-1">Total Vendors</h3>
            <p className="text-2xl font-black text-charcoal-grey">{mockAnalytics.overview.totalVendors}</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-black text-charcoal-grey mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {mockAnalytics.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-charcoal-grey/5 hover:bg-charcoal-grey/10 transition-colors"
              >
                <div>
                  <p className="font-semibold text-charcoal-grey">{activity.description}</p>
                  <p className="text-sm text-charcoal-grey/60 mt-1">{activity.time}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg bg-charcoal-grey/10 text-charcoal-grey/70 font-medium">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;

