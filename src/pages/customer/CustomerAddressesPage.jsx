import { useState } from "react";
import { FiMapPin, FiEdit, FiTrash2, FiPlus, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import ConfirmDialog from "../../ui/modals/ConfirmDialog";
import MapLocationPicker from "../../features/checkout/components/MapLocationPicker";

// Mock addresses - replace with actual API call
const mockAddresses = [
  {
    id: 1,
    label: "Home",
    address: "123 Main Street, Kathmandu 44600",
    city: "Kathmandu",
    area: "Thamel",
    landmark: "Near ABC Mall",
    isDefault: true,
  },
  {
    id: 2,
    label: "Work",
    address: "456 Business Park, Kathmandu 44600",
    city: "Kathmandu",
    area: "Durbar Marg",
    landmark: "Office Building",
    isDefault: false,
  },
];

const CustomerAddressesPage = () => {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    address: "",
    city: "",
    area: "",
    landmark: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    variant: "danger",
  });

  const handleDelete = (id) => {
    const address = addresses.find((addr) => addr.id === id);
    setConfirmDialog({
      isOpen: true,
      title: "Delete Address",
      message: `Are you sure you want to delete "${address?.label || 'this address'}"? This action cannot be undone.`,
      onConfirm: () => {
        setAddresses(addresses.filter((addr) => addr.id !== id));
        toast.success("Address deleted successfully");
      },
      variant: "danger",
    });
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success("Default address updated");
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      address: address.address,
      city: address.city,
      area: address.area,
      landmark: address.landmark || "",
    });
    setIsAdding(false);
  };

  const handleSaveAddress = () => {
    if (!formData.label || !formData.address || !formData.city) {
      toast.error("Please fill in at least label, address, and city");
      return;
    }

    if (editingId) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId
            ? { ...addr, ...formData }
            : addr
        )
      );
      toast.success("Address updated successfully");
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      toast.success("Address added successfully");
    }

    // Reset form
    setFormData({ label: "", address: "", city: "", area: "", landmark: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setFormData({ label: "", address: "", city: "", area: "", landmark: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey mb-2">
              Saved Addresses
            </h1>
            <p className="text-charcoal-grey/70">
              Manage your delivery addresses
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAdding(!isAdding)}
          >
            <FiPlus className="w-5 h-5" />
            Add Address
          </Button>
        </div>

        {/* Add/Edit Address Form */}
        {(isAdding || editingId) && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-charcoal-grey mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal-grey mb-2">
                  Label (e.g., Home, Office)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Home, Office, Work..."
                  className="w-full px-4 py-2 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal-grey mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                  className="w-full px-4 py-2 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-grey mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Kathmandu"
                    className="w-full px-4 py-2 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-grey mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="Thamel"
                    className="w-full px-4 py-2 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal-grey mb-2">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="Near ABC Mall"
                  className="w-full px-4 py-2 border border-charcoal-grey/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-amber/25 focus:border-golden-amber/35 text-charcoal-grey bg-white text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="primary" size="md" className="flex-1" onClick={handleSaveAddress}>
                  {editingId ? "Update Address" : "Save Address"}
                </Button>
                <Button variant="ghost" size="md" className="flex-1" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Addresses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                    <FiMapPin className="w-6 h-6 text-deep-maroon" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal-grey text-lg">{address.label}</h3>
                    {address.isDefault && (
                      <span className="inline-block px-2 py-1 rounded-full bg-golden-amber/10 text-golden-amber text-xs font-semibold border border-golden-amber/20">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 text-charcoal-grey/80">
                <p>{address.address}</p>
                {address.landmark && <p className="text-sm text-charcoal-grey/60">Near: {address.landmark}</p>}
                <p className="text-sm text-charcoal-grey/60">{address.area}, {address.city}</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-charcoal-grey/10">
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <FiCheck className="w-4 h-4" />
                    Set Default
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>
                  <FiEdit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {addresses.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-charcoal-grey mb-2">No addresses saved</h3>
              <p className="text-charcoal-grey/60 mb-6">
                Add your first delivery address to get started
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsAdding(true)}
              >
                <FiPlus className="w-5 h-5" />
                Add Address
              </Button>
            </div>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm || (() => {})}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Delete"
          cancelText="Cancel"
          variant={confirmDialog.variant}
        />
      </div>
    </div>
  );
};

export default CustomerAddressesPage;

