import { useState } from "react";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import { FiSearch, FiMail, FiPhone, FiCalendar, FiShoppingBag, FiStar } from "react-icons/fi";
import VendorDetailModal from "../../features/admin-dashboard/modals/VendorDetailModal";

// Mock data - replace with actual API calls
const mockVendors = [
  {
    id: 1,
    name: "Momo House",
    businessName: "Momo House Restaurant",
    email: "momo.house@example.com",
    phone: "+977 9834567890",
    joinDate: "Dec 20, 2023",
    status: "active",
    totalOrders: 156,
    rating: 4.5,
    totalRevenue: 245000,
  },
  {
    id: 2,
    name: "Delicious Momos",
    businessName: "Delicious Momos & More",
    email: "delicious.momos@example.com",
    phone: "+977 9845678901",
    joinDate: "Dec 15, 2023",
    status: "active",
    totalOrders: 98,
    rating: 4.8,
    totalRevenue: 189000,
  },
  {
    id: 3,
    name: "Street Momo Corner",
    businessName: "Street Momo Corner",
    email: "street.momo@example.com",
    phone: "+977 9856789012",
    joinDate: "Jan 5, 2024",
    status: "pending",
    totalOrders: 12,
    rating: 4.2,
    totalRevenue: 15000,
  },
];

const AdminVendorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || vendor.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-charcoal-grey">Vendor Management</h1>
            <p className="text-charcoal-grey/70 mt-1">Manage all platform vendors</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-grey/35" />
              <input
                type="text"
                placeholder="Search vendors by name, business, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-charcoal-grey/2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "primary" : "ghost"}
                size="md"
                onClick={() => setSelectedStatus("all")}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === "active" ? "primary" : "ghost"}
                size="md"
                onClick={() => setSelectedStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={selectedStatus === "pending" ? "primary" : "ghost"}
                size="md"
                onClick={() => setSelectedStatus("pending")}
              >
                Pending
              </Button>
            </div>
          </div>
        </Card>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-maroon to-golden-amber flex items-center justify-center text-white font-bold text-lg">
                    {vendor.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal-grey">{vendor.businessName}</h3>
                    <p className="text-xs text-charcoal-grey/60">{vendor.name}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    vendor.status === "active"
                      ? "bg-green-50 text-green-600"
                      : vendor.status === "pending"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {vendor.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiMail className="w-4 h-4" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiPhone className="w-4 h-4" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiCalendar className="w-4 h-4" />
                  <span>Joined {vendor.joinDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-charcoal-grey/70">
                    <FiShoppingBag className="w-4 h-4" />
                    <span>{vendor.totalOrders} orders</span>
                  </div>
                  <div className="flex items-center gap-1 text-golden-amber">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{vendor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <span className="font-semibold">Revenue:</span>
                  <span>Rs. {vendor.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setIsModalOpen(true);
                  }}
                >
                  View Details
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-charcoal-grey/60">No vendors found</p>
          </Card>
        )}
      </div>

      {/* Vendor Detail Modal */}
      <VendorDetailModal
        vendor={selectedVendor}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVendor(null);
        }}
        onUpdate={(vendorId, updatedData) => {
          // TODO: Replace with actual API call
          console.log("Update vendor:", vendorId, updatedData);
        }}
        onApprove={(vendorId) => {
          // TODO: Replace with actual API call
          console.log("Approve vendor:", vendorId);
        }}
        onReject={(vendorId) => {
          // TODO: Replace with actual API call
          console.log("Reject vendor:", vendorId);
        }}
      />
    </div>
  );
};

export default AdminVendorsPage;

