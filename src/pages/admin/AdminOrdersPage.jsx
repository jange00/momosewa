import { useState, useMemo } from "react";
import OrdersHeader from "../../features/admin-dashboard/components/OrdersHeader";
import OrdersTabs from "../../features/admin-dashboard/components/OrdersTabs";
import OrdersGrid from "../../features/admin-dashboard/components/OrdersGrid";
import OrdersStats from "../../features/admin-dashboard/components/OrdersStats";
import VendorFilter from "../../features/admin-dashboard/components/VendorFilter";
import Card from "../../ui/cards/Card";

// Mock data - replace with actual API calls
// Admin view includes customer and vendor information
const mockOrders = [
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
    date: "Jan 14, 2024 - 08:15 PM",
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
    date: "Jan 14, 2024 - 01:45 PM",
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
  {
    id: "ORD-12342",
    date: "Jan 13, 2024 - 07:20 PM",
    status: "preparing",
    total: 480.00,
    itemsCount: 2,
    customer: {
      name: "Ram Bahadur",
      email: "ram.bahadur@example.com",
      phone: "+977 9801234567",
    },
    vendor: {
      name: "Street Momo Corner",
      businessName: "Street Momo Corner",
    },
    items: [
      { name: "Buff Momo (10 pcs)", quantity: 2, price: 580, emoji: "🥟" },
    ],
  },
  {
    id: "ORD-12341",
    date: "Jan 13, 2024 - 05:10 PM",
    status: "pending",
    total: 350.00,
    itemsCount: 1,
    customer: {
      name: "Sita Kumari",
      email: "sita.kumari@example.com",
      phone: "+977 9812345678",
    },
    vendor: {
      name: "Momo House",
      businessName: "Momo House Restaurant",
    },
    items: [
      { name: "Veg Momo (10 pcs)", quantity: 1, price: 220, emoji: "🥟" },
    ],
  },
  {
    id: "ORD-12340",
    date: "Jan 12, 2024 - 03:45 PM",
    status: "cancelled",
    total: 420.00,
    itemsCount: 2,
    customer: {
      name: "Hari Prasad",
      email: "hari.prasad@example.com",
      phone: "+977 9823456789",
    },
    vendor: {
      name: "Delicious Momos",
      businessName: "Delicious Momos & More",
    },
    items: [
      { name: "Steam Momo (10 pcs)", quantity: 1, price: 250, emoji: "🥟" },
      { name: "Jhol Momo (10 pcs)", quantity: 1, price: 300, emoji: "🥟" },
    ],
  },
];

const AdminOrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState("all"); // "all" means no status filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("all");

  // Extract unique vendors from orders
  const vendors = useMemo(() => {
    const vendorMap = new Map();
    
    mockOrders.forEach((order) => {
      if (order.vendor) {
        const vendorId = order.vendor.businessName || order.vendor.name;
        if (!vendorMap.has(vendorId)) {
          vendorMap.set(vendorId, {
            id: vendorId,
            name: order.vendor.name,
            businessName: order.vendor.businessName || order.vendor.name,
            orderCount: 0,
          });
        }
        vendorMap.get(vendorId).orderCount++;
      }
    });
    
    return Array.from(vendorMap.values()).sort((a, b) => 
      a.businessName.localeCompare(b.businessName)
    );
  }, []);

  // Filter orders based on selected tab, vendor, and search query
  const filteredOrders = useMemo(() => {
    let filtered = mockOrders;

    // Filter by vendor
    if (selectedVendor !== "all") {
      filtered = filtered.filter(
        (order) =>
          order.vendor?.businessName === selectedVendor ||
          order.vendor?.name === selectedVendor
      );
    }

    // Filter by status
    if (selectedTab !== "all") {
      filtered = filtered.filter((order) => order.status === selectedTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer?.name.toLowerCase().includes(query) ||
          order.vendor?.name?.toLowerCase().includes(query) ||
          order.vendor?.businessName?.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedTab, selectedVendor, searchQuery]);

  // Calculate stats based on vendor filter (before status filter)
  const stats = useMemo(() => {
    let ordersToCount = mockOrders;
    
    // Apply vendor filter for stats
    if (selectedVendor !== "all") {
      ordersToCount = ordersToCount.filter(
        (order) =>
          order.vendor?.businessName === selectedVendor ||
          order.vendor?.name === selectedVendor
      );
    }
    
    return {
      total: ordersToCount.length,
      pending: ordersToCount.filter((o) => o.status === "pending").length,
      preparing: ordersToCount.filter((o) => o.status === "preparing").length,
      onTheWay: ordersToCount.filter((o) => o.status === "on-the-way").length,
      delivered: ordersToCount.filter((o) => o.status === "delivered").length,
      cancelled: ordersToCount.filter((o) => o.status === "cancelled").length,
    };
  }, [selectedVendor]);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <OrdersHeader
          title="All Orders"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* Vendor Filter */}
        <Card className="p-6">
          <VendorFilter
            vendors={vendors}
            selectedVendor={selectedVendor}
            onVendorChange={setSelectedVendor}
            onClear={() => setSelectedVendor("all")}
          />
        </Card>

        <OrdersStats stats={stats} />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-charcoal-grey">Filter by Status</h3>
            {selectedTab !== "all" && (
              <button
                onClick={() => setSelectedTab("all")}
                className="text-sm text-deep-maroon hover:underline"
              >
                Clear Status Filter
              </button>
            )}
          </div>
          <OrdersTabs selectedTab={selectedTab} onTabChange={setSelectedTab} ordersCount={stats} />
        </div>
        <OrdersGrid orders={filteredOrders} />
      </div>
    </div>
  );
};

export default AdminOrdersPage;

