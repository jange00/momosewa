import { FiTrendingUp, FiDollarSign, FiPackage, FiUsers } from "react-icons/fi";
import Card from "../../ui/cards/Card";
import StatCard from "../../ui/cards/StatCard";

// Mock analytics data - replace with actual API call
const mockAnalytics = {
  totalRevenue: 245000,
  totalOrders: 156,
  totalCustomers: 89,
  averageOrderValue: 1570,
  revenueTrend: 22,
  ordersTrend: 18,
  customersTrend: 15,
  avgOrderTrend: 5,
};

const VendorAnalyticsPage = () => {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey mb-2">
            Analytics & Insights
          </h1>
          <p className="text-charcoal-grey/70">
            Track your sales, revenue, and customer insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${mockAnalytics.totalRevenue.toLocaleString()}`}
            trend={mockAnalytics.revenueTrend}
            icon={FiDollarSign}
          />
          <StatCard
            title="Total Orders"
            value={mockAnalytics.totalOrders}
            trend={mockAnalytics.ordersTrend}
            icon={FiPackage}
          />
          <StatCard
            title="Total Customers"
            value={mockAnalytics.totalCustomers}
            trend={mockAnalytics.customersTrend}
            icon={FiUsers}
          />
          <StatCard
            title="Avg. Order Value"
            value={`Rs. ${mockAnalytics.averageOrderValue.toLocaleString()}`}
            trend={mockAnalytics.avgOrderTrend}
            icon={FiTrendingUp}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-charcoal-grey mb-6">
              Revenue Overview
            </h2>
            <div className="h-64 flex items-center justify-center text-charcoal-grey/40">
              <p>Chart will be implemented here</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-charcoal-grey mb-6">
              Order Trends
            </h2>
            <div className="h-64 flex items-center justify-center text-charcoal-grey/40">
              <p>Chart will be implemented here</p>
            </div>
          </Card>
        </div>

        {/* Additional Analytics */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-charcoal-grey mb-6">
            Product Performance
          </h2>
          <div className="space-y-4">
            <p className="text-charcoal-grey/60">
              Product performance analytics will be displayed here
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VendorAnalyticsPage;

