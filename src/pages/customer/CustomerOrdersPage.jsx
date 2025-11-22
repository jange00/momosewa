import { useState, useMemo } from "react";
import OrdersHeader from "../../features/customer-dashboard/components/OrdersHeader";
import OrdersTabs from "../../features/customer-dashboard/components/OrdersTabs";
import OrdersGrid from "../../features/customer-dashboard/components/OrdersGrid";
import OrdersStats from "../../features/customer-dashboard/components/OrdersStats";

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

  const filteredOrders = useMemo(() => {
    return activeTab === "all"
      ? mockOrders
      : mockOrders.filter((order) => order.status === activeTab);
  }, [activeTab]);

  const ordersCount = useMemo(() => {
    const counts = {
      total: mockOrders.length,
      pending: 0,
      preparing: 0,
      "on-the-way": 0,
      delivered: 0,
      cancelled: 0,
    };

    mockOrders.forEach((order) => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    });

    return counts;
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <OrdersHeader />
        <OrdersTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ordersCount={ordersCount}
        />
        <OrdersGrid orders={filteredOrders} />
        <OrdersStats orders={mockOrders} />
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
