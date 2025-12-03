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

        {/* Add Address Form */}
        {isAdding && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-charcoal-grey mb-4">Add New Address</h2>
            <div className="space-y-4">
              <MapLocationPicker />
              <Button variant="primary" size="md" className="w-full">
                Save Address
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="w-full"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
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
                <Button variant="ghost" size="sm">
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

