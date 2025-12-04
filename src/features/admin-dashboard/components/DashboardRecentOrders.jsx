import { Link } from "react-router-dom";
import AdminOrderCard from "./AdminOrderCard";
import Button from "../../../ui/buttons/Button";

const DashboardRecentOrders = ({ orders }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-charcoal-grey">Recent Orders</h2>
        <Link to="/admin/orders">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <AdminOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default DashboardRecentOrders;

