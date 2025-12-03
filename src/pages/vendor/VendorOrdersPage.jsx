import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import OrdersHeader from "../../features/vendor-dashboard/components/OrdersHeader";
import OrdersTabs from "../../features/vendor-dashboard/components/OrdersTabs";
import OrdersGrid from "../../features/vendor-dashboard/components/OrdersGrid";
import OrdersStats from "../../features/vendor-dashboard/components/OrdersStats";

// Mock data - replace with actual API calls
// Vendor-focused: includes customer information and delivery details
const initialOrders = [
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
      name: "John Doe",
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
      name: "Jane Smith",
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
      name: "Raj Kumar",
      phone: "+977 9823456789",
      address: "789 Residential Area, New Baneshwor, Kathmandu 44600",
    },
  },
  {
    id: "ORD-12342",
    date: "Jan 15, 2024 - 01:20 PM",
    status: "delivered",
    total: 480.00,
    itemsCount: 2,
    items: [
      { name: "Buff Momo (10 pcs)", quantity: 2, price: 580, emoji: "🥟" },
    ],
    customer: {
      name: "Sarah Johnson",
      phone: "+977 9834567890",
      address: "321 Shopping Complex, Lazimpat, Kathmandu 44600",
    },
  },
  {
    id: "ORD-12341",
    date: "Jan 15, 2024 - 12:00 PM",
    status: "delivered",
    total: 320.00,
    itemsCount: 1,
    items: [
      { name: "C-Momo (1 plate)", quantity: 1, price: 320, emoji: "🥟" },
    ],
    customer: {
      name: "Mike Chen",
      phone: "+977 9845678901",
      address: "555 Apartment Block, Patan, Lalitpur 44700",
    },
  },
  {
    id: "ORD-12340",
    date: "Jan 14, 2024 - 08:45 PM",
    status: "cancelled",
    total: 650.00,
    itemsCount: 3,
    items: [
      { name: "Kothey Momo (10 pcs)", quantity: 2, price: 540, emoji: "🥟" },
      { name: "Veg Momo (10 pcs)", quantity: 1, price: 220, emoji: "🥟" },
    ],
    customer: {
      name: "Lisa Wang",
      phone: "+977 9856789012",
      address: "999 Restaurant Street, Basantapur, Kathmandu 44600",
    },
  },
];

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("all");

  // Handle order status updates
  const handleStatusUpdate = (orderId, newStatus) => {
    // Update local state optimistically
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Show success message
    const statusMessages = {
      pending: "Order marked as pending",
      preparing: "Order accepted! Start preparing now.",
      "on-the-way": "Order marked as ready for delivery",
      delivered: "Order marked as delivered!",
      cancelled: "Order cancelled",
    };
    
    toast.success(statusMessages[newStatus] || `Order status updated to ${newStatus}`);
    
    // TODO: Replace with actual API call
    // try {
    //   await api.put(`/orders/${orderId}/status`, { status: newStatus });
    // } catch (error) {
    //   toast.error("Failed to update order status");
    //   // Revert on error
    //   setOrders(initialOrders);
    // }
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const filteredOrders = useMemo(() => {
    return activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);
  }, [activeTab, orders]);

  const ordersCount = useMemo(() => {
    const counts = {
      total: orders.length,
      pending: 0,
      preparing: 0,
      "on-the-way": 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    });

    return counts;
  }, [orders]);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <OrdersHeader />
        <OrdersTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ordersCount={ordersCount}
        />
        <OrdersGrid orders={filteredOrders} onStatusUpdate={handleStatusUpdate} />
        <OrdersStats orders={orders} />
      </div>
    </div>
  );
};

export default VendorOrdersPage;

