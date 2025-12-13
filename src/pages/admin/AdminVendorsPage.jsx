import { useState } from "react";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import { FiSearch, FiMail, FiPhone, FiCalendar, FiShoppingBag, FiStar, FiDownload } from "react-icons/fi";
import VendorDetailModal from "../../features/admin-dashboard/modals/VendorDetailModal";
import toast from "react-hot-toast";
import { useGet, usePatch } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../api/config";
import apiClient from "../../api/client";

const AdminVendorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch vendors from API
  const { data: vendorsData, isLoading, refetch } = useGet(
    'admin-vendors',
    `${API_ENDPOINTS.ADMIN}/vendors`,
    { showErrorToast: true }
  );

  const vendors = vendorsData?.data?.vendors || vendorsData?.data || [];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      (vendor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.phone || '').includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || vendor.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApproveVendor = async (vendorId) => {
    try {
      const vendorIdValue = vendorId || selectedVendor?._id || selectedVendor?.id;
      if (!vendorIdValue) {
        toast.error("Vendor ID is required");
        return;
      }
      
      // Use correct endpoint: PUT /admin/vendors/:id/approve
      const response = await apiClient.put(
        `${API_ENDPOINTS.ADMIN}/vendors/${vendorIdValue}/approve`
      );
      
      const result = response.data;
      if (result.success) {
        const vendorEmail = selectedVendor?.email || '';
        toast.success(
          result.message || "Vendor approved successfully! They can now log in to their account.",
          { duration: 5000 }
        );
        // Show additional info about vendor being able to log in
        if (vendorEmail) {
          toast.info(
            `Vendor ${vendorEmail} can now log in and access their dashboard.`,
            { duration: 4000 }
          );
        }
        refetch();
        setIsModalOpen(false);
        setSelectedVendor(null);
      } else {
        toast.error(result.message || "Failed to approve vendor");
      }
    } catch (error) {
      console.error("Failed to approve vendor:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to approve vendor";
      toast.error(errorMessage);
    }
  };

  const handleRejectVendor = async (vendorId) => {
    try {
      const vendorIdValue = vendorId || selectedVendor?._id || selectedVendor?.id;
      if (!vendorIdValue) {
        toast.error("Vendor ID is required");
        return;
      }
      
      // Use correct endpoint: PUT /admin/vendors/:id/reject
      const response = await apiClient.put(
        `${API_ENDPOINTS.ADMIN}/vendors/${vendorIdValue}/reject`,
        { reason: "Application rejected by admin" }
      );
      
      const result = response.data;
      if (result.success) {
        toast.success(result.message || "Vendor rejected successfully!");
        refetch();
        setIsModalOpen(false);
        setSelectedVendor(null);
      } else {
        toast.error(result.message || "Failed to reject vendor");
      }
    } catch (error) {
      console.error("Failed to reject vendor:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to reject vendor";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-maroon"></div>
      </div>
    );
  }

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
              const vendorId = vendor._id || vendor.id;
              // Check if vendor applied recently (within last 24 hours)
              const isNew = vendor.applicationDate && 
                (new Date() - new Date(vendor.applicationDate)) < 24 * 60 * 60 * 1000;
              
              return (
                <Card key={vendorId} className={`p-6 relative ${vendor.status === "pending" ? "border-l-4 border-yellow-500" : ""}`}>
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
                    {(vendor.name || vendor.businessName || 'V').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal-grey">{vendor.businessName || vendor.name || 'Vendor'}</h3>
                    {vendor.name && vendor.name !== vendor.businessName && (
                      <p className="text-xs text-charcoal-grey/60">{vendor.name}</p>
                    )}
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
                    {(vendor.createdAt || vendor.joinDate || vendor.applicationDate) && (
                      <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Applied {vendor.joinDate || vendor.applicationDate || 
                            (vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'Recently')}
                        </span>
                      </div>
                    )}
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
                    {(vendor.createdAt || vendor.joinDate) && (
                      <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Joined {vendor.joinDate || 
                            (vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A')}
                        </span>
                      </div>
                    )}
                    {(vendor.totalOrders !== undefined) && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-charcoal-grey/70">
                          <FiShoppingBag className="w-4 h-4" />
                          <span>{vendor.totalOrders || 0} orders</span>
                        </div>
                        {vendor.rating && (
                          <div className="flex items-center gap-1 text-golden-amber">
                            <FiStar className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{vendor.rating}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {(vendor.totalRevenue !== undefined) && (
                      <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                        <span className="font-semibold">Revenue:</span>
                        <span>Rs. {(vendor.totalRevenue || 0).toLocaleString()}</span>
                      </div>
                    )}
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
        onUpdate={async (vendorId, updatedData) => {
          try {
            // TODO: Implement vendor update API call
            await refetch();
            setIsModalOpen(false);
            setSelectedVendor(null);
          } catch (error) {
            console.error("Failed to update vendor:", error);
          }
        }}
        onApprove={handleApproveVendor}
        onReject={handleRejectVendor}
      />
    </div>
  );
};

export default AdminVendorsPage;

