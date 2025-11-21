import { Navigate } from 'react-router-dom';
import { USER_ROLES, ROLE_DASHBOARD_ROUTES } from '../common/roleConstants';

/**
 * Protected Route Component with Role-Based Access Control
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if access is granted
 * @param {string|string[]} props.requiredRole - Single role or array of roles that can access this route
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem("role");

  // If no role (not logged in), redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Convert requiredRole to array for easier checking
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  // Check if user's role is in the allowed roles
  const hasAccess = allowedRoles.includes(role);

  // If user doesn't have access, redirect to their dashboard
  if (!hasAccess) {
    const dashboardRoute = ROLE_DASHBOARD_ROUTES[role] || "/";
    return <Navigate to={dashboardRoute} replace />;
  }

  // User has access, render the protected content
  return children;
};

export default ProtectedRoute;

