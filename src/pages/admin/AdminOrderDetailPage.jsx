import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiClock, 
  FiMapPin, 
  FiPackage, 
  FiUser,
  FiShoppingBag,
  FiPrinter,
  FiMail,
  FiPhone
} from "react-icons/fi";
import toast from "react-hot-toast";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import Badge from "../../ui/badges/Badge";

// Mock order data - replace with actual API call
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
      email: "momo.house@example.com",
      phone: "+977 9834567890",
    },
    items: [
      { name: "Steam Momo (10 pcs)", quantity: 2, price: 500, emoji: "🥟" },
      { name: "Jhol Momo (10 pcs)", quantity: 1, price: 300, emoji: "🥟" },
    ],
    deliveryAddress: "123 Main Street, Thamel, Kathmandu 44600",
    paymentMethod: "Cash on Delivery",
    subtotal: 500.00,
    deliveryFee: 50.00,
    discount: 0,
    notes: "Please call before delivery",
    estimatedDelivery: "Jan 15, 2024 - 03:00 PM",
  },
  {
    id: "ORD-12344",
    date: "Jan 14, 2024 - 08:15 PM",
    deliveredDate: "Jan 14, 2024 - 09:30 PM",
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
      email: "delicious.momos@example.com",
      phone: "+977 9845678901",
    },
    items: [
      { name: "Fried Momo (8 pcs)", quantity: 2, price: 560, emoji: "🥟" },
      { name: "C-Momo (1 plate)", quantity: 1, price: 320, emoji: "🥟" },
    ],
    deliveryAddress: "456 Business Park, Durbar Marg, Kathmandu 44600",
    paymentMethod: "Khalti",
    subtotal: 720.00,
    deliveryFee: 0,
    discount: 50.00,
    notes: "",
  },
];

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Find order by ID
    const foundOrder = mockOrders.find((o) => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      toast.error("Order not found");
      navigate("/admin/orders");
    }
  }, [id, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    preparing: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    "on-the-way": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    delivered: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };

  const statusLabels = {
    pending: "Pending",
    preparing: "Preparing",
    "on-the-way": "On the Way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const status = statusColors[order.status] || statusColors.pending;
  const statusLabel = statusLabels[order.status] || order.status;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-charcoal-grey">Order #{order.id}</h1>
              <p className="text-charcoal-grey/70 mt-1">Order Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}
            >
              {statusLabel}
            </span>
            <Button variant="ghost" size="sm">
              <FiPrinter className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-black text-charcoal-grey mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-charcoal-grey/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.emoji || "🥟"}</span>
                      <div>
                        <h3 className="font-semibold text-charcoal-grey">{item.name}</h3>
                        <p className="text-sm text-charcoal-grey/60">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-deep-maroon">Rs. {item.price}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Information */}
            <Card className="p-6">
              <h2 className="text-xl font-black text-charcoal-grey mb-4">Delivery Information</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-charcoal-grey/60 mt-1" />
                  <div>
                    <p className="font-semibold text-charcoal-grey">Delivery Address</p>
                    <p className="text-charcoal-grey/70">{order.deliveryAddress}</p>
                  </div>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex items-start gap-3">
                    <FiClock className="w-5 h-5 text-charcoal-grey/60 mt-1" />
                    <div>
                      <p className="font-semibold text-charcoal-grey">Estimated Delivery</p>
                      <p className="text-charcoal-grey/70">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                )}
                {order.deliveredDate && (
                  <div className="flex items-start gap-3">
                    <FiClock className="w-5 h-5 text-charcoal-grey/60 mt-1" />
                    <div>
                      <p className="font-semibold text-charcoal-grey">Delivered On</p>
                      <p className="text-charcoal-grey/70">{order.deliveredDate}</p>
                    </div>
                  </div>
                )}
                {order.notes && (
                  <div className="flex items-start gap-3">
                    <FiPackage className="w-5 h-5 text-charcoal-grey/60 mt-1" />
                    <div>
                      <p className="font-semibold text-charcoal-grey">Special Notes</p>
                      <p className="text-charcoal-grey/70">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-xl font-black text-charcoal-grey mb-4">Customer</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-maroon to-golden-amber flex items-center justify-center text-white font-bold text-lg">
                    {order.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal-grey">{order.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiMail className="w-4 h-4" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiPhone className="w-4 h-4" />
                  <span>{order.customer.phone}</span>
                </div>
              </div>
            </Card>

            {/* Vendor Information */}
            <Card className="p-6">
              <h2 className="text-xl font-black text-charcoal-grey mb-4">Vendor</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-maroon to-golden-amber flex items-center justify-center text-white font-bold text-lg">
                    {order.vendor.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal-grey">{order.vendor.businessName}</p>
                    <p className="text-xs text-charcoal-grey/60">{order.vendor.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiMail className="w-4 h-4" />
                  <span>{order.vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-grey/70">
                  <FiPhone className="w-4 h-4" />
                  <span>{order.vendor.phone}</span>
                </div>
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-black text-charcoal-grey mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-grey/70">Subtotal</span>
                  <span className="font-semibold">Rs. {order.subtotal.toFixed(2)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-grey/70">Delivery Fee</span>
                    <span className="font-semibold">Rs. {order.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-grey/70">Discount</span>
                    <span className="font-semibold text-green-600">-Rs. {order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-charcoal-grey/10 pt-3 flex justify-between">
                  <span className="font-bold text-charcoal-grey">Total</span>
                  <span className="font-black text-deep-maroon text-lg">Rs. {order.total.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-charcoal-grey/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-grey/70">Payment Method</span>
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;

