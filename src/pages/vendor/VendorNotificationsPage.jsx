import { FiBell, FiCheck } from "react-icons/fi";
import Card from "../../ui/cards/Card";
import Badge from "../../ui/badges/Badge";

// Mock notifications - replace with actual API call
const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-12345 has been placed",
    time: "2 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    type: "order",
    title: "Order Status Updated",
    message: "Order #ORD-12344 is now on the way",
    time: "15 minutes ago",
    isRead: false,
  },
  {
    id: 3,
    type: "system",
    title: "Weekly Report",
    message: "Your weekly sales report is ready",
    time: "1 hour ago",
    isRead: true,
  },
  {
    id: 4,
    type: "order",
    title: "Order Completed",
    message: "Order #ORD-12343 has been delivered",
    time: "2 hours ago",
    isRead: true,
  },
];

const VendorNotificationsPage = () => {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-charcoal-grey mb-2">
              Notifications
            </h1>
            <p className="text-charcoal-grey/70">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-6 ${!notification.isRead ? "border-l-4 border-l-deep-maroon" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-maroon/10 via-golden-amber/5 to-deep-maroon/10 flex items-center justify-center flex-shrink-0">
                  <FiBell className="w-6 h-6 text-deep-maroon" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-charcoal-grey">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge variant="primary">New</Badge>
                        )}
                      </div>
                      <p className="text-charcoal-grey/70 text-sm">
                        {notification.message}
                      </p>
                    </div>
                    <div className="text-xs text-charcoal-grey/60 whitespace-nowrap">
                      {notification.time}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <button className="text-sm text-deep-maroon hover:text-deep-maroon/80 flex items-center gap-2 mt-2">
                      <FiCheck className="w-4 h-4" />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {mockNotifications.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-charcoal-grey mb-2">
                No notifications
              </h3>
              <p className="text-charcoal-grey/60">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorNotificationsPage;

