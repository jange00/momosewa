import { Outlet } from "react-router-dom";

const VendorLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Vendor-specific navbar/sidebar can be added here later */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;

