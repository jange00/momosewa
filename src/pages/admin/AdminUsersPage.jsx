import { useState } from "react";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import { FiSearch, FiUser, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import UserDetailModal from "../../features/admin-dashboard/modals/UserDetailModal";

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: 1,
    name: "Ram Bahadur",
    email: "ram.bahadur@example.com",
    phone: "+977 9801234567",
    role: "Customer",
    joinDate: "Jan 10, 2024",
    status: "active",
    totalOrders: 24,
  },
  {
    id: 2,
    name: "Sita Kumari",
    email: "sita.kumari@example.com",
    phone: "+977 9812345678",
    role: "Customer",
    joinDate: "Jan 8, 2024",
    status: "active",
    totalOrders: 18,
  },
  {
    id: 3,
    name: "Hari Prasad",
    email: "hari.prasad@example.com",
    phone: "+977 9823456789",
    role: "Customer",
    joinDate: "Jan 5, 2024",
    status: "active",
    totalOrders: 32,
  },
  {
    id: 4,
    name: "Momo House",
    email: "momo.house@example.com",
    phone: "+977 9834567890",
    role: "Vendor",
    joinDate: "Dec 20, 2023",
    status: "active",
    totalOrders: 156,
  },
];

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-charcoal-grey">User Management</h1>
            <p className="text-charcoal-grey/70 mt-1">Manage all platform users</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-grey/35" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-charcoal-grey/2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRole === "all" ? "primary" : "ghost"}
                size="md"
                onClick={() => setSelectedRole("all")}
              >
                All
              </Button>
              <Button
                variant={selectedRole === "Customer" ? "primary" : "ghost"}
                size="md"
                onClick={() => setSelectedRole("Customer")}
              >
                Customers
              </Button>
              <Button
                variant={selectedRole === "Vendor" ? "primary" : "ghost"}
                size="md"
                onClick={() => setSelectedRole("Vendor")}
              >
                Vendors
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-maroon to-golden-amber flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal-grey">{user.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-lg bg-charcoal-grey/10 text-charcoal-grey/70 font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    user.status === "active"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiMail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiPhone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiCalendar className="w-4 h-4" />
                  <span>Joined {user.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiUser className="w-4 h-4" />
                  <span>{user.totalOrders} orders</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedUser(user);
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
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-charcoal-grey/60">No users found</p>
          </Card>
        )}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdate={(userId, updatedData) => {
          // TODO: Replace with actual API call
          console.log("Update user:", userId, updatedData);
        }}
      />
    </div>
  );
};

export default AdminUsersPage;

