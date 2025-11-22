import { useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import RecentOrderCard from "../../features/dashboard/components/RecentOrderCard";
import Card from "../../ui/cards/Card";
import Badge from "../../ui/badges/Badge";
import Button from "../../ui/buttons/Button";
import EmptyState from "../../ui/empty/EmptyState";

const ORDER_TABS = [
  { id: "all", label: "All Orders", icon: FiPackage },
  { id: "pending", label: "Pending", icon: FiClock },
  { id: "preparing", label: "Preparing", icon: FiPackage },
  { id: "on-the-way", label: "On the Way", icon: FiTruck },
  { id: "delivered", label: "Delivered", icon: FiCheckCircle },
  { id: "cancelled", label: "Cancelled", icon: FiXCircle },
];

// Mock data - replace with actual API calls
const mockOrders = [
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
  {
    id: "ORD-12342",
    date: "Jan 13, 2024 - 07:20 PM",
    status: "preparing",
    total: 480.00,
    itemsCount: 2,
    items: [
      { name: "Buff Momo (10 pcs)", quantity: 2, price: 580, emoji: "🥟" },
    ],
  },
  {
    id: "ORD-12341",
    date: "Jan 12, 2024 - 12:00 PM",
    status: "pending",
    total: 320.00,
    itemsCount: 1,
    items: [
      { name: "C-Momo (1 plate)", quantity: 1, price: 320, emoji: "🥟" },
    ],
  },
  {
    id: "ORD-12340",
    date: "Jan 11, 2024 - 06:45 PM",
    status: "delivered",
    total: 650.00,
    itemsCount: 3,
    items: [
      { name: "Kothey Momo (10 pcs)", quantity: 2, price: 540, emoji: "🥟" },
      { name: "Veg Momo (10 pcs)", quantity: 1, price: 220, emoji: "🥟" },
    ],
  },
];

const CustomerOrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders =
    activeTab === "all"
      ? mockOrders
      : mockOrders.filter((order) => order.status === activeTab);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey mb-2">
            My Orders
          </h1>
          <p className="text-charcoal-grey/70">
            View and manage all your orders
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {ORDER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count =
              tab.id === "all"
                ? mockOrders.length
                : mockOrders.filter((order) => order.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-deep-maroon to-[#7a2533] text-white shadow-lg"
                    : "bg-white/60 backdrop-blur-sm text-charcoal-grey/70 hover:bg-charcoal-grey/5 hover:text-deep-maroon border border-charcoal-grey/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-deep-maroon/10 text-deep-maroon"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <RecentOrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <EmptyState
              onClearFilters={() => setActiveTab("all")}
            />
            <div className="text-center mt-6">
              <p className="text-charcoal-grey/60 mb-4">No orders found in this category</p>
              <Link to="/menu">
                <Button variant="primary" size="md">
                  Order Now
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 text-center">
            <p className="text-sm text-charcoal-grey/60 mb-1">Total Orders</p>
            <p className="text-2xl font-black text-charcoal-grey">{mockOrders.length}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-charcoal-grey/60 mb-1">Active Orders</p>
            <p className="text-2xl font-black text-deep-maroon">
              {mockOrders.filter((o) => ["pending", "preparing", "on-the-way"].includes(o.status)).length}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-charcoal-grey/60 mb-1">Completed Orders</p>
            <p className="text-2xl font-black text-green-600">
              {mockOrders.filter((o) => o.status === "delivered").length}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersPage;

