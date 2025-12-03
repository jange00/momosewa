import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiClock, 
  FiUser, 
  FiPhone, 
  FiMapPin, 
  FiPackage, 
  FiCheck, 
  FiX, 
  FiTruck,
  FiPrinter,
  FiMessageSquare,
  FiTrendingUp,
  FiCalendar,
  FiShoppingBag
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
      email: "ram@example.com",
    },
    paymentMethod: "Cash on Delivery",
    subtotal: 500.00,
    deliveryFee: 50.00,
    discount: 0,
    notes: "Please call before delivery",
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
      email: "sita@example.com",
    },
    paymentMethod: "Khalti",
    subtotal: 720.00,
    deliveryFee: 50.00,
    discount: 50.00,
    notes: "",
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
      email: "hari@example.com",
    },
    paymentMethod: "Cash on Delivery",
    subtotal: 550.00,
    deliveryFee: 50.00,
    discount: 0,
    notes: "Deliver to main gate",
  },
  {
    id: "ORD-12342",
    date: "Jan 15, 2024 - 01:20 PM",
    deliveredDate: "Jan 15, 2024 - 03:45 PM",
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
      email: "sunita@example.com",
      totalOrders: 5,
      totalSpent: 3500.00,
    },
    paymentMethod: "Cash on Delivery",
    subtotal: 430.00,
    deliveryFee: 50.00,
    discount: 0,
    notes: "Regular customer, prefers spicy",
    timeline: [
      { status: "pending", time: "Jan 15, 2024 - 01:20 PM", label: "Order Placed" },
      { status: "preparing", time: "Jan 15, 2024 - 01:25 PM", label: "Order Accepted" },
      { status: "on-the-way", time: "Jan 15, 2024 - 02:30 PM", label: "Out for Delivery" },
      { status: "delivered", time: "Jan 15, 2024 - 03:45 PM", label: "Delivered" },
    ],
  },
  {
    id: "ORD-12341",
    date: "Jan 14, 2024 - 11:00 AM",
    deliveredDate: "Jan 14, 2024 - 01:30 PM",
    status: "delivered",
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
      email: "sita@example.com",
      totalOrders: 3,
      totalSpent: 2100.00,
    },
    paymentMethod: "Khalti",
    subtotal: 720.00,
    deliveryFee: 50.00,
    discount: 50.00,
    notes: "",
    timeline: [
      { status: "pending", time: "Jan 14, 2024 - 11:00 AM", label: "Order Placed" },
      { status: "preparing", time: "Jan 14, 2024 - 11:05 AM", label: "Order Accepted" },
      { status: "on-the-way", time: "Jan 14, 2024 - 12:15 PM", label: "Out for Delivery" },
      { status: "delivered", time: "Jan 14, 2024 - 01:30 PM", label: "Delivered" },
    ],
  },
];

const VendorOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundOrder = mockOrders.find((o) => o.id === id);
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

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

  const handleStatusUpdate = (newStatus) => {
    if (newStatus === "cancelled") {
      if (!window.confirm(`Are you sure you want to cancel order #${order.id}? This action cannot be undone.`)) {
        return;
      }
    }

    setOrder({ ...order, status: newStatus });

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
    //   await api.put(`/orders/${order.id}/status`, { status: newStatus });
    // } catch (error) {
    //   toast.error("Failed to update order status");
    //   // Revert on error
    //   setOrder(mockOrders.find((o) => o.id === id));
    // }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleContactCustomer = () => {
    if (order?.customer?.phone) {
      window.location.href = `tel:${order.customer.phone}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-maroon mx-auto"></div>
          <p className="mt-4 text-charcoal-grey/60">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-charcoal-grey mb-2">Order Not Found</h2>
            <p className="text-charcoal-grey/60 mb-6">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/vendor/orders">
              <Button variant="primary" size="md">
                <FiArrowLeft className="w-4 h-4" />
                Back to Orders
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const status = statusColors[order.status] || statusColors.pending;
  const statusLabel = statusLabels[order.status] || order.status;

  const canAccept = order.status === "pending";
  const canReject = order.status === "pending";
  const canStartPreparing = order.status === "pending";
  const canMarkReady = order.status === "preparing";
  const canMarkOnWay = order.status === "preparing";
  const canMarkDelivered = order.status === "on-the-way";

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/vendor/orders">
              <Button variant="ghost" size="sm">
                <FiArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey mb-2">
                Order #{order.id}
              </h1>
              <p className="text-charcoal-grey/70 flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                {order.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleContactCustomer}>
              <FiMessageSquare className="w-4 h-4" />
              Contact
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePrint}>
              <FiPrinter className="w-4 h-4" />
              Print
            </Button>
            <Badge
              variant={order.status === "delivered" ? "success" : order.status === "cancelled" ? "error" : "primary"}
            >
              {statusLabel}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        {(canAccept || canReject || canStartPreparing || canMarkReady || canMarkOnWay || canMarkDelivered) && (
          <Card className="p-6">
            <div className="flex items-center gap-3 flex-wrap">
              {canAccept && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleStatusUpdate("preparing")}
                >
                  <FiCheck className="w-4 h-4" />
                  Accept & Start Preparing
                </Button>
              )}
              {canReject && (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => handleStatusUpdate("cancelled")}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <FiX className="w-4 h-4" />
                  Reject Order
                </Button>
              )}
              {canStartPreparing && !canAccept && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleStatusUpdate("preparing")}
                >
                  <FiPackage className="w-4 h-4" />
                  Start Preparing
                </Button>
              )}
              {canMarkReady && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleStatusUpdate("on-the-way")}
                >
                  <FiTruck className="w-4 h-4" />
                  Mark Ready for Delivery
                </Button>
              )}
              {canMarkOnWay && !canMarkReady && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleStatusUpdate("on-the-way")}
                >
                  <FiTruck className="w-4 h-4" />
                  Mark On the Way
                </Button>
              )}
              {canMarkDelivered && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleStatusUpdate("delivered")}
                >
                  <FiCheck className="w-4 h-4" />
                  Mark as Delivered
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Completed Order Summary - Show for delivered orders */}
        {order.status === "delivered" && (
          <Card className="p-6 bg-gradient-to-br from-green-50/50 to-white border-2 border-green-200/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal-grey">Order Completed Successfully</h2>
                  <p className="text-sm text-charcoal-grey/60">
                    This order has been delivered and completed
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-white/60">
                <p className="text-sm text-charcoal-grey/60 mb-1">Order Value</p>
                <p className="text-lg font-bold text-deep-maroon">Rs. {order.total.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/60">
                <p className="text-sm text-charcoal-grey/60 mb-1">Items Ordered</p>
                <p className="text-lg font-bold text-charcoal-grey">{order.itemsCount} items</p>
              </div>
              {order.deliveredDate && (
                <div className="p-4 rounded-xl bg-white/60">
                  <p className="text-sm text-charcoal-grey/60 mb-1">Delivered On</p>
                  <p className="text-lg font-bold text-charcoal-grey">{order.deliveredDate.split(" - ")[0]}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-charcoal-grey mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-charcoal-grey/5 border border-charcoal-grey/10"
                  >
                    <div className="text-3xl">{item.emoji || "🥟"}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-charcoal-grey">{item.name}</h3>
                      <p className="text-sm text-charcoal-grey/60">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-deep-maroon">
                        Rs. {item.price}
                      </p>
                      <p className="text-sm text-charcoal-grey/60">
                        Rs. {(item.price * item.quantity).toFixed(2)} total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Notes */}
            {order.notes && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-charcoal-grey mb-4">Delivery Notes</h2>
                <p className="text-charcoal-grey/80">{order.notes}</p>
              </Card>
            )}

            {/* Order Timeline - Show for delivered orders */}
            {order.status === "delivered" && order.timeline && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-charcoal-grey mb-6">Order Timeline</h2>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          event.status === "preparing" ? "bg-blue-100 text-blue-700" :
                          event.status === "on-the-way" ? "bg-purple-100 text-purple-700" :
                          event.status === "delivered" ? "bg-green-100 text-green-700" :
                          "bg-charcoal-grey/10 text-charcoal-grey"
                        }`}>
                          {event.status === "pending" && <FiClock className="w-5 h-5" />}
                          {event.status === "preparing" && <FiPackage className="w-5 h-5" />}
                          {event.status === "on-the-way" && <FiTruck className="w-5 h-5" />}
                          {event.status === "delivered" && <FiCheck className="w-5 h-5" />}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-charcoal-grey/20 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-bold text-charcoal-grey">{event.label}</p>
                        <p className="text-sm text-charcoal-grey/60">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Customer & Payment Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-charcoal-grey mb-6">Customer Information</h2>
              
              {/* Customer Order History - Show for delivered orders */}
              {order.status === "delivered" && order.customer?.totalOrders && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-deep-maroon/5 via-golden-amber/5 to-deep-maroon/5 border border-deep-maroon/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                      <FiTrendingUp className="w-5 h-5 text-deep-maroon" />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal-grey/60">Customer Since</p>
                      <p className="font-bold text-charcoal-grey">{order.customer.totalOrders} Orders</p>
                    </div>
                  </div>
                  {order.customer.totalSpent && (
                    <div className="flex items-center gap-2 text-sm">
                      <FiShoppingBag className="w-4 h-4 text-charcoal-grey/60" />
                      <span className="text-charcoal-grey/70">Total Spent: </span>
                      <span className="font-bold text-deep-maroon">Rs. {order.customer.totalSpent.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-deep-maroon" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-grey/60">Name</p>
                    <p className="font-bold text-charcoal-grey">{order.customer?.name}</p>
                  </div>
                </div>
                {order.customer?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                      <FiPhone className="w-5 h-5 text-deep-maroon" />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal-grey/60">Phone</p>
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="font-bold text-deep-maroon hover:underline"
                      >
                        {order.customer.phone}
                      </a>
                    </div>
                  </div>
                )}
                {order.customer?.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-deep-maroon" />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal-grey/60">Email</p>
                      <p className="font-bold text-charcoal-grey">{order.customer.email}</p>
                    </div>
                  </div>
                )}
                {order.customer?.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiMapPin className="w-5 h-5 text-deep-maroon" />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal-grey/60">Delivery Address</p>
                      <p className="font-medium text-charcoal-grey">{order.customer.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-charcoal-grey mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-charcoal-grey/80">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-charcoal-grey/80">
                    <span>Delivery Fee</span>
                    <span>Rs. {order.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- Rs. {order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-charcoal-grey/10 flex justify-between">
                  <span className="font-bold text-charcoal-grey">Total</span>
                  <span className="font-bold text-deep-maroon text-lg">
                    Rs. {order.total.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-charcoal-grey/10">
                  <p className="text-sm text-charcoal-grey/60 mb-1">Payment Method</p>
                  <p className="font-medium text-charcoal-grey">{order.paymentMethod}</p>
                </div>
              </div>
            </Card>

            {/* Delivery Information - Show for delivered orders */}
            {order.status === "delivered" && order.deliveredDate && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-charcoal-grey mb-6">Delivery Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                      <FiCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-charcoal-grey/60">Delivered On</p>
                      <p className="font-bold text-charcoal-grey flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        {order.deliveredDate}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-charcoal-grey/10">
                    <p className="text-sm text-charcoal-grey/60 mb-2">Delivery Status</p>
                    <Badge variant="success" className="inline-flex items-center gap-2">
                      <FiCheck className="w-4 h-4" />
                      Successfully Delivered
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOrderDetailPage;

