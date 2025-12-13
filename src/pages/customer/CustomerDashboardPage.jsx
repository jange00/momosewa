import DashboardWelcome from "../../features/customer-dashboard/components/DashboardWelcome";
import DashboardStats from "../../features/customer-dashboard/components/DashboardStats";
import DashboardQuickActions from "../../features/customer-dashboard/components/DashboardQuickActions";
import DashboardRecentOrders from "../../features/customer-dashboard/components/DashboardRecentOrders";
import DashboardOffers from "../../features/customer-dashboard/components/DashboardOffers";
import { useAuth } from "../../hooks/useAuth";
import { useGet } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../api/config";

const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const userName = user?.name || "Customer";

  // Fetch orders for stats and recent orders
  const { data: ordersData, isLoading: ordersLoading } = useGet(
    'customer-orders',
    API_ENDPOINTS.ORDERS,
    { showErrorToast: true }
  );

  const orders = ordersData?.data?.orders || ordersData?.data || [];
  
  // Calculate stats from orders
  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter((o) => 
      ['pending', 'preparing', 'on-the-way'].includes(o.status)
    ).length,
    totalSpent: orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.total || o.amount || 0), 0),
  };

  // Get recent orders (last 3)
  const recentOrders = orders.slice(0, 3);

  if (ordersLoading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-maroon"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardWelcome userName={userName} />
        <DashboardStats stats={stats} />
        <DashboardQuickActions />
        <DashboardRecentOrders orders={recentOrders} />
        <DashboardOffers />
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
