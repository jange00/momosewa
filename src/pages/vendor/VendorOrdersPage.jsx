import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import OrdersHeader from "../../features/vendor-dashboard/components/OrdersHeader";
import OrdersTabs from "../../features/vendor-dashboard/components/OrdersTabs";
import OrdersGrid from "../../features/vendor-dashboard/components/OrdersGrid";
import OrdersStats from "../../features/vendor-dashboard/components/OrdersStats";
import Card from "../../ui/cards/Card";

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
      name: "Sunita",
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
      name: "Anil",
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
      name: "Priya",
      phone: "+977 9856789012",
      address: "999 Restaurant Street, Basantapur, Kathmandu 44600",
    },
  },
];

const VendorOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Sync search query with URL
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [searchQuery, setSearchParams]);

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
    let filtered = activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesCustomerName = order.customer?.name?.toLowerCase().includes(query);
        const matchesPhone = order.customer?.phone?.includes(query);
        const matchesAddress = order.customer?.address?.toLowerCase().includes(query);
        const matchesItems = order.items?.some((item) => 
          item.name.toLowerCase().includes(query)
        );
        return matchesId || matchesCustomerName || matchesPhone || matchesAddress || matchesItems;
      });
    }

    return filtered;
  }, [activeTab, orders, searchQuery]);

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
        
        {/* Search Bar */}
        <Card className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FiSearch className="w-5 h-5 text-charcoal-grey/35" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID, customer name, phone, or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-charcoal-grey/2 hover:bg-charcoal-grey/4 transition-all duration-300 placeholder:text-charcoal-grey/30 text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-charcoal-grey/60 hover:text-charcoal-grey transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-charcoal-grey/60 mt-2">
              Found {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </p>
          )}
        </Card>

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

