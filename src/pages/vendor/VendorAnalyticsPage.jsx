import { useState } from "react";
import { FiTrendingUp, FiBarChart2, FiPackage, FiUsers } from "react-icons/fi";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

// Revenue data for the last 7 days
const revenueData = [
  { date: "Mon", revenue: 12000, orders: 8 },
  { date: "Tue", revenue: 15000, orders: 10 },
  { date: "Wed", revenue: 18000, orders: 12 },
  { date: "Thu", revenue: 22000, orders: 15 },
  { date: "Fri", revenue: 28000, orders: 18 },
  { date: "Sat", revenue: 35000, orders: 22 },
  { date: "Sun", revenue: 32000, orders: 20 },
];

// Order status distribution
const orderStatusData = [
  { name: "Delivered", value: 120, color: "#10b981" },
  { name: "On the Way", value: 15, color: "#8b5cf6" },
  { name: "Preparing", value: 12, color: "#3b82f6" },
  { name: "Pending", value: 9, color: "#f59e0b" },
];

// Top products performance
const productPerformanceData = [
  { name: "Steam Momo", orders: 45, revenue: 11250 },
  { name: "Fried Momo", orders: 38, revenue: 10640 },
  { name: "C-Momo", orders: 32, revenue: 10240 },
  { name: "Jhol Momo", orders: 28, revenue: 8400 },
  { name: "Chicken Momo", orders: 25, revenue: 13000 },
];

const COLORS = ["#7a2533", "#d4af37", "#3b82f6", "#10b981", "#f59e0b"];

const VendorAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("week");

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
            icon={FiBarChart2}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-charcoal-grey">
                Revenue Overview
              </h2>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-charcoal-grey/15 text-sm font-medium text-charcoal-grey bg-white focus:outline-none focus:ring-2 focus:ring-golden-amber/25"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [`Rs. ${value.toLocaleString()}`, "Revenue"];
                    }
                    return [value, "Orders"];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7a2533"
                  strokeWidth={3}
                  dot={{ fill: "#7a2533", r: 4 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#d4af37"
                  strokeWidth={2}
                  dot={{ fill: "#d4af37", r: 4 }}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-charcoal-grey mb-6">
              Order Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Product Performance */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-charcoal-grey mb-6">
            Top Products Performance
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={productPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px",
                }}
                formatter={(value, name) => {
                  if (name === "revenue") {
                    return [`Rs. ${value.toLocaleString()}`, "Revenue"];
                  }
                  return [value, "Orders"];
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#7a2533" name="Orders" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#d4af37" name="Revenue (Rs.)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default VendorAnalyticsPage;

