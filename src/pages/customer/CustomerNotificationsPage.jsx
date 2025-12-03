import { useState, useEffect } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import Card from "../../ui/cards/Card";
import Badge from "../../ui/badges/Badge";

// Mock notifications - replace with actual API call
const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "Order On the Way",
    message: "Your order #ORD-12345 is on the way. Estimated delivery: 15 minutes",
    date: "2 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    type: "promotion",
    title: "Weekend Special",
    message: "Get 15% off on all orders above Rs. 500. Use code: WEEKEND15",
    date: "1 hour ago",
    isRead: false,
  },
  {
    id: 3,
    type: "order",
    title: "Order Delivered",
    message: "Your order #ORD-12344 has been delivered successfully!",
    date: "Yesterday",
    isRead: true,
  },
];

const CustomerNotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAsRead = (id) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    
    setNotifications(updatedNotifications);
    toast.success("Notification marked as read");
    
    // Save to localStorage
    localStorage.setItem("customerNotifications", JSON.stringify(updatedNotifications));
    
    // Trigger event for header update
    window.dispatchEvent(new Event("customerNotificationsUpdated"));
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, isRead: true }));
    
    setNotifications(updatedNotifications);
    toast.success("All notifications marked as read");
    
    // Save to localStorage
    localStorage.setItem("customerNotifications", JSON.stringify(updatedNotifications));
    
    // Trigger event for header update
    window.dispatchEvent(new Event("customerNotificationsUpdated"));
  };

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("customerNotifications");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      } catch (e) {
        // Keep mock data if parse fails
      }
    } else {
      localStorage.setItem("customerNotifications", JSON.stringify(mockNotifications));
    }
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey mb-2">
              Notifications
            </h1>
            <p className="text-charcoal-grey/70">
              Stay updated with your orders and offers
            </p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={notifications.every((n) => n.isRead)}
            className="px-4 py-2 rounded-xl bg-charcoal-grey/5 text-charcoal-grey/70 hover:bg-charcoal-grey/10 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-5 ${
                !notification.isRead
                  ? "border-l-4 border-l-deep-maroon bg-deep-maroon/5"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center flex-shrink-0">
                  <FiBell className="w-6 h-6 text-deep-maroon" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-charcoal-grey">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-deep-maroon"></span>
                    )}
                  </div>
                  <p className="text-charcoal-grey/70 mb-2">{notification.message}</p>
                  <p className="text-sm text-charcoal-grey/60">{notification.date}</p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-2 rounded-lg hover:bg-charcoal-grey/5 text-charcoal-grey/60 flex-shrink-0 transition-colors"
                  >
                    <FiCheck className="w-5 h-5" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-charcoal-grey mb-2">No notifications</h3>
              <p className="text-charcoal-grey/60">
                You're all caught up! New notifications will appear here
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerNotificationsPage;

