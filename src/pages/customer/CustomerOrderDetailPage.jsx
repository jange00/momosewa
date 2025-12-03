import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiClock, 
  FiMapPin, 
  FiPackage, 
  FiCheck, 
  FiTruck,
  FiPrinter,
  FiShoppingBag,
  FiCalendar,
  FiStar
} from "react-icons/fi";
import toast from "react-hot-toast";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import Badge from "../../ui/badges/Badge";
import ConfirmDialog from "../../ui/modals/ConfirmDialog";

// Mock order data - replace with actual API call
const mockOrders = [
  {
    id: "ORD-12345",
    date: "Jan 15, 2024 - 02:30 PM",
    status: "on-the-way",
    total: 550.00,
    itemsCount: 3,
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
  {
    id: "ORD-12343",
    date: "Jan 14, 2024 - 01:45 PM",
    deliveredDate: "Jan 14, 2024 - 03:00 PM",
    status: "delivered",
    total: 600.00,
    itemsCount: 2,
    items: [
      { name: "Chicken Momo (10 pcs)", quantity: 2, price: 520, emoji: "🥟" },
      { name: "Veg Momo (10 pcs)", quantity: 1, price: 220, emoji: "🥟" },
    ],
    deliveryAddress: "789 Residential Area, New Baneshwor, Kathmandu 44600",
    paymentMethod: "Cash on Delivery",
    subtotal: 550.00,
    deliveryFee: 50.00,
    discount: 0,
    notes: "Deliver to main gate",
  },
  {
    id: "ORD-12342",
    date: "Jan 13, 2024 - 07:20 PM",
    status: "preparing",
    total: 480.00,
    itemsCount: 2,
    items: [
      { name: "Buff Momo (10 pcs)", quantity: 2, price: 580, emoji: "🥟" },
    ],
    deliveryAddress: "321 Shopping Complex, Lazimpat, Kathmandu 44600",
    paymentMethod: "Cash on Delivery",
    subtotal: 480.00,
    deliveryFee: 50.00,
    discount: 50.00,
    notes: "",
    estimatedDelivery: "Jan 13, 2024 - 08:30 PM",
  },
  {
    id: "ORD-12341",
    date: "Jan 12, 2024 - 12:00 PM",
    status: "pending",
    total: 320.00,
    itemsCount: 1,
    items: [
      { name: "C-Momo (1 plate)", quantity: 1, price: 320, emoji: "🥟" },
    ],
    deliveryAddress: "555 Apartment Block, Patan, Lalitpur 44700",
    paymentMethod: "Khalti",
    subtotal: 320.00,
    deliveryFee: 50.00,
    discount: 50.00,
    notes: "",
  },
  {
    id: "ORD-12340",
    date: "Jan 11, 2024 - 06:45 PM",
    deliveredDate: "Jan 11, 2024 - 08:00 PM",
    status: "delivered",
    total: 650.00,
    itemsCount: 3,
    items: [
      { name: "Kothey Momo (10 pcs)", quantity: 2, price: 540, emoji: "🥟" },
      { name: "Veg Momo (10 pcs)", quantity: 1, price: 220, emoji: "🥟" },
    ],
    deliveryAddress: "999 Restaurant Street, Basantapur, Kathmandu 44600",
    paymentMethod: "Cash on Delivery",
    subtotal: 650.00,
    deliveryFee: 0,
    discount: 0,
    notes: "",
  },
];

const CustomerOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    variant: "danger",
  });

  useEffect(() => {
    // Simulate API call
    const fetchOrder = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const foundOrder = mockOrders.find((o) => o.id === id);
      setOrder(foundOrder);
      setIsLoading(false);
    };

    fetchOrder();
  }, [id]);

  const handleReorder = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Reorder Items",
      message: `Add all items from order #${order.id} to your cart?`,
      onConfirm: () => {
        // TODO: Add items to cart
        toast.success("Items added to cart! Redirecting to cart...");
        setTimeout(() => {
          navigate("/cart");
        }, 1000);
      },
      variant: "warning",
    });
  };

  const handleCancelOrder = () => {
    if (order.status === "pending" || order.status === "preparing") {
      setConfirmDialog({
        isOpen: true,
        title: "Cancel Order",
        message: `Are you sure you want to cancel order #${order.id}? This action cannot be undone.`,
        onConfirm: () => {
          setOrder({ ...order, status: "cancelled" });
          toast.success("Order cancelled successfully");
          // TODO: Replace with actual API call
        },
        variant: "danger",
      });
    } else {
      toast.error("This order cannot be cancelled");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRateOrder = () => {
    navigate(`/customer/reviews?order=${order.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-maroon mx-auto mb-4"></div>
          <p className="text-charcoal-grey/60">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/customer/orders">
            <Button variant="ghost" size="sm" className="mb-6">
              <FiArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
          </Link>
          <Card className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-charcoal-grey mb-2">Order Not Found</h3>
              <p className="text-charcoal-grey/60 mb-6">
                The order you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/customer/orders">
                <Button variant="primary" size="md">
                  View All Orders
                </Button>
              </Link>
            </div>
          </Card>
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/customer/orders">
            <Button variant="ghost" size="sm">
              <FiArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {(order.status === "pending" || order.status === "preparing") && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelOrder}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Cancel Order
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handlePrint}>
              <FiPrinter className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Order Status Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-charcoal-grey mb-2">
                Order #{order.id}
              </h1>
              <p className="text-charcoal-grey/60 flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                {order.date}
              </p>
            </div>
            <Badge
              variant={order.status === "delivered" ? "success" : "default"}
              className={`${status.bg} ${status.text} ${status.border} border`}
            >
              {statusLabel}
            </Badge>
          </div>

          {/* Status Progress */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ["pending", "preparing", "on-the-way", "delivered"].indexOf(order.status) >= 0
                  ? "bg-deep-maroon text-white"
                  : "bg-charcoal-grey/20 text-charcoal-grey/40"
              }`}>
                <FiPackage className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-charcoal-grey">Order Placed</p>
                <p className="text-sm text-charcoal-grey/60">{order.date}</p>
              </div>
            </div>

            {order.status !== "pending" && (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ["preparing", "on-the-way", "delivered"].indexOf(order.status) >= 0
                    ? "bg-deep-maroon text-white"
                    : "bg-charcoal-grey/20 text-charcoal-grey/40"
                }`}>
                  <FiShoppingBag className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-charcoal-grey">Preparing</p>
                  {order.status === "preparing" && (
                    <p className="text-sm text-charcoal-grey/60">Your order is being prepared</p>
                  )}
                </div>
              </div>
            )}

            {["on-the-way", "delivered"].includes(order.status) && (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.status === "delivered"
                    ? "bg-deep-maroon text-white"
                    : "bg-deep-maroon text-white"
                }`}>
                  <FiTruck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-charcoal-grey">On the Way</p>
                  {order.estimatedDelivery && (
                    <p className="text-sm text-charcoal-grey/60">
                      Estimated delivery: {order.estimatedDelivery}
                    </p>
                  )}
                </div>
              </div>
            )}

            {order.status === "delivered" && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-charcoal-grey">Delivered</p>
                  {order.deliveredDate && (
                    <p className="text-sm text-charcoal-grey/60">
                      Delivered on: {order.deliveredDate}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-charcoal-grey mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-charcoal-grey/10 last:border-0">
                <div className="text-3xl">{item.emoji || "🥟"}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-charcoal-grey">{item.name}</h3>
                  <p className="text-sm text-charcoal-grey/60">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-charcoal-grey">Rs. {item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-charcoal-grey mb-6">Delivery Information</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                <FiMapPin className="w-5 h-5 text-deep-maroon" />
              </div>
              <div>
                <p className="text-sm text-charcoal-grey/60 mb-1">Delivery Address</p>
                <p className="font-semibold text-charcoal-grey">{order.deliveryAddress}</p>
              </div>
            </div>
            {order.notes && (
              <div className="pt-3 border-t border-charcoal-grey/10">
                <p className="text-sm text-charcoal-grey/60 mb-1">Delivery Notes</p>
                <p className="text-charcoal-grey">{order.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-charcoal-grey mb-6">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-charcoal-grey/70">Subtotal</span>
              <span className="font-semibold text-charcoal-grey">Rs. {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-grey/70">Delivery Fee</span>
              <span className="font-semibold text-charcoal-grey">Rs. {order.deliveryFee.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-Rs. {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-charcoal-grey/10 flex justify-between">
              <span className="font-bold text-lg text-charcoal-grey">Total</span>
              <span className="font-black text-xl text-deep-maroon">Rs. {order.total.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-charcoal-grey/10">
              <p className="text-sm text-charcoal-grey/60 mb-1">Payment Method</p>
              <p className="font-semibold text-charcoal-grey">{order.paymentMethod}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {order.status === "delivered" && (
            <>
              <Button
                variant="primary"
                size="md"
                onClick={handleReorder}
                className="flex-1"
              >
                <FiShoppingBag className="w-5 h-5" />
                Reorder
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleRateOrder}
                className="flex-1"
              >
                <FiStar className="w-5 h-5" />
                Rate Order
              </Button>
            </>
          )}
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm || (() => {})}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Confirm"
          cancelText="Cancel"
          variant={confirmDialog.variant}
        />
      </div>
    </div>
  );
};

export default CustomerOrderDetailPage;

