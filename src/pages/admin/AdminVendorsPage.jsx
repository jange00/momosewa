import { useState, useEffect } from "react";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import { FiSearch, FiMail, FiPhone, FiCalendar, FiShoppingBag, FiStar, FiDownload } from "react-icons/fi";
import VendorDetailModal from "../../features/admin-dashboard/modals/VendorDetailModal";
import { getPendingVendors, getApprovedVendors, approveVendor, rejectVendor } from "../../utils/pendingVendors";
import toast from "react-hot-toast";

// Initial mock data for demonstration
const initializeMockVendors = () => {
  // Check if vendors already exist in storage
  const existingPending = getPendingVendors();
  const existingApproved = getApprovedVendors();
  
  // Only add mock data if storage is empty
  if (existingPending.length === 0 && existingApproved.length === 0) {
    const mockPendingVendors = [
      {
        id: "VENDOR-MOCK-001",
        role: "vendor",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@momosewa.com",
        phone: "+977 9801234567",
        businessName: "Rajesh's Momo Corner",
        businessAddress: "Thamel, Kathmandu",
        businessLicense: "LIC-2024-001",
        storeName: "Rajesh's Momo Corner",
        status: "pending",
        applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "VENDOR-MOCK-002",
        role: "vendor",
        name: "Sita Devi",
        email: "sita.devi@momosewa.com",
        phone: "+977 9812345678",
        businessName: "Sita's Delicious Momos",
        businessAddress: "New Road, Kathmandu",
        businessLicense: "LIC-2024-002",
        storeName: "Sita's Delicious Momos",
        status: "pending",
        applicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "VENDOR-MOCK-003",
        role: "vendor",
        name: "Hari Bahadur",
        email: "hari.bahadur@momosewa.com",
        phone: "+977 9823456789",
        businessName: "Hari's Street Food",
        businessAddress: "Durbar Marg, Kathmandu",
        businessLicense: "LIC-2024-003",
        storeName: "Hari's Street Food",
        status: "pending",
        applicationDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const mockApprovedVendors = [
  {
        id: "VENDOR-MOCK-004",
        role: "vendor",
    name: "Momo House",
        email: "momo.house@momosewa.com",
        phone: "+977 9834567890",
    businessName: "Momo House Restaurant",
        businessAddress: "Lazimpat, Kathmandu",
        businessLicense: "LIC-2023-100",
        storeName: "Momo House Restaurant",
    status: "active",
        applicationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        approvedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
        id: "VENDOR-MOCK-005",
        role: "vendor",
    name: "Delicious Momos",
        email: "delicious.momos@momosewa.com",
        phone: "+977 9845678901",
    businessName: "Delicious Momos & More",
        businessAddress: "Baneshwor, Kathmandu",
        businessLicense: "LIC-2023-101",
        storeName: "Delicious Momos & More",
    status: "active",
        applicationDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
        approvedDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(), // 23 days ago
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Save mock data to localStorage
    localStorage.setItem("pendingVendors", JSON.stringify(mockPendingVendors));
    localStorage.setItem("approvedVendors", JSON.stringify(mockApprovedVendors));
  }
};

const AdminVendorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendors, setVendors] = useState([]);

  // Initialize mock data and load vendors from storage
  useEffect(() => {
    initializeMockVendors();
    loadVendors();
  }, []);

  const loadVendors = () => {
    const pendingVendors = getPendingVendors();
    const approvedVendors = getApprovedVendors();
    
    // Combine and format vendors
    const allVendors = [
      ...pendingVendors.map(v => ({
        ...v,
        joinDate: v.applicationDate ? new Date(v.applicationDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) : "N/A",
        totalOrders: 0, // Mock data - replace with actual
        rating: 0, // Mock data - replace with actual
        totalRevenue: 0, // Mock data - replace with actual
      })),
      ...approvedVendors.map(v => ({
        ...v,
        joinDate: v.approvedDate ? new Date(v.approvedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) : "N/A",
        totalOrders: Math.floor(Math.random() * 200) + 50, // Random between 50-250
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Random between 3.5-5.0
        totalRevenue: Math.floor(Math.random() * 300000) + 100000, // Random between 100k-400k
      })),
    ];
    
    setVendors(allVendors);
  };

  const filteredVendors = vendors.filter((vendor) => {
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
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              // Export functionality
              toast.success("Export feature coming soon!");
            }}
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export Data
          </Button>
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

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-sm text-charcoal-grey/60 mb-1">Total Vendors</p>
            <p className="text-2xl font-black text-charcoal-grey">{vendors.length}</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-transparent border-green-200">
            <p className="text-sm text-charcoal-grey/60 mb-1">Active</p>
            <p className="text-2xl font-black text-green-600">
              {vendors.filter((v) => v.status === "active").length}
            </p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-transparent border-yellow-200">
            <p className="text-sm text-charcoal-grey/60 mb-1">Pending Review</p>
            <p className="text-2xl font-black text-yellow-600">
              {vendors.filter((v) => v.status === "pending").length}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-charcoal-grey/60 mb-1">Rejected</p>
            <p className="text-2xl font-black text-red-600">
              {vendors.filter((v) => v.status === "rejected").length}
            </p>
          </Card>
        </div>

        {/* Pending Vendors Alert */}
        {vendors.filter((v) => v.status === "pending").length > 0 && (
          <Card className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <p className="font-bold text-charcoal-grey">
                    {vendors.filter((v) => v.status === "pending").length} vendor application(s) pending review
                  </p>
                  <p className="text-sm text-charcoal-grey/70">
                    Review and approve vendor applications to activate their accounts
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedStatus("pending")}
              >
                Review Now
              </Button>
            </div>
          </Card>
        )}

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => {
              // Check if vendor applied recently (within last 24 hours)
              const isNew = vendor.applicationDate && 
                (new Date() - new Date(vendor.applicationDate)) < 24 * 60 * 60 * 1000;
              
              return (
                <Card key={vendor.id} className={`p-6 relative ${vendor.status === "pending" ? "border-l-4 border-yellow-500" : ""}`}>
                  {isNew && vendor.status === "pending" && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                        NEW
                      </span>
                    </div>
                  )}
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
                {vendor.status === "pending" ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                      <FiCalendar className="w-4 h-4" />
                      <span>Applied {vendor.joinDate}</span>
                    </div>
                    {vendor.businessAddress && (
                      <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                        <span className="font-semibold">Location:</span>
                        <span className="truncate">{vendor.businessAddress}</span>
                      </div>
                    )}
                    {vendor.businessLicense && (
                      <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                        <span className="font-semibold">License:</span>
                        <span>{vendor.businessLicense}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                  {vendor.status === "pending" ? "Review" : "View Details"}
                </Button>
                {vendor.status === "pending" ? (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setIsModalOpen(true);
                    }}
                  >
                    Approve
                  </Button>
                ) : (
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
                )}
              </div>
            </Card>
            );
            })}
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
          // Update vendor in state
          setVendors((prevVendors) =>
            prevVendors.map((v) =>
              v.id === vendorId ? { ...v, ...updatedData } : v
            )
          );
          // Update selected vendor if it's the same one
          if (selectedVendor?.id === vendorId) {
            setSelectedVendor({ ...selectedVendor, ...updatedData });
          }
          // Reload vendors to get updated data
          loadVendors();
          // TODO: Replace with actual API call
          console.log("Update vendor:", vendorId, updatedData);
        }}
        onApprove={(vendorId) => {
          try {
            // Approve vendor using utility function
            approveVendor(vendorId);
            toast.success("Vendor approved successfully!");
            
            // Reload vendors list
            loadVendors();
            
            // Close modal
            setIsModalOpen(false);
            setSelectedVendor(null);
            
          // TODO: Replace with actual API call
            // In production, also send email notification to vendor
          } catch (error) {
            toast.error(error.message || "Failed to approve vendor");
          }
        }}
        onReject={(vendorId) => {
          try {
            // Reject vendor using utility function
            rejectVendor(vendorId);
            toast.success("Vendor application rejected");
            
            // Reload vendors list
            loadVendors();
            
            // Close modal
            setIsModalOpen(false);
            setSelectedVendor(null);
            
          // TODO: Replace with actual API call
            // In production, also send email notification to vendor
          } catch (error) {
            toast.error(error.message || "Failed to reject vendor");
          }
        }}
      />
    </div>
  );
};

export default AdminVendorsPage;

