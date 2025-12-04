import { useState, useEffect } from "react";
import Card from "../../ui/cards/Card";
import Button from "../../ui/buttons/Button";
import { FiBell, FiCheck, FiTrash2, FiPackage, FiUsers, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";

// Mock notifications - replace with actual API calls
const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-12345 has been placed",
    time: "2 minutes ago",
    isRead: false,
    icon: FiPackage,
  },
  {
    id: 2,
    type: "user",
    title: "New User Registered",
    message: "A new customer has joined the platform",
    time: "15 minutes ago",
    isRead: false,
    icon: FiUsers,
  },
  {
    id: 3,
    type: "vendor",
    title: "New Vendor Application",
    message: "Street Momo Corner has applied to join",
    time: "1 hour ago",
    isRead: false,
    icon: FiShoppingBag,
  },
  {
    id: 4,
    type: "order",
    title: "Order Delivered",
    message: "Order #ORD-12344 has been delivered",
    time: "2 hours ago",
    isRead: true,
    icon: FiPackage,
  },
  {
    id: 5,
    type: "order",
    title: "Order Cancelled",
    message: "Order #ORD-12340 has been cancelled",
    time: "3 hours ago",
    isRead: true,
    icon: FiPackage,
  },
];

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    toast.success("Notification deleted");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-charcoal-grey">Notifications</h1>
            <p className="text-charcoal-grey/70 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="primary" size="md" onClick={markAllAsRead}>
              <FiCheck className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <FiBell className="w-16 h-16 text-charcoal-grey/30 mx-auto mb-4" />
              <p className="text-charcoal-grey/60">No notifications</p>
            </Card>
          ) : (
            notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`p-6 ${!notification.isRead ? "bg-deep-maroon/5 border-deep-maroon/20" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-deep-maroon" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-charcoal-grey">{notification.title}</h3>
                          <p className="text-charcoal-grey/70 mt-1">{notification.message}</p>
                          <p className="text-sm text-charcoal-grey/50 mt-2">{notification.time}</p>
                        </div>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-deep-maroon"></span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <FiCheck className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;

