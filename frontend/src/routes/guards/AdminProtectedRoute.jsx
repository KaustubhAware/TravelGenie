import {
  Navigate,
} from "react-router-dom";

import RouteLoader from "../../components/RouteLoader";
import { useAuth } from "../../context/AuthContext";
import { getAdminToken } from "../../utils/authToken";

export default function AdminProtectedRoute({
  children,
}) {
  const {
    adminAuthLoading,
    adminInitialized,
    isAdminAuthenticated,
  } = useAuth();

  if (!adminInitialized || adminAuthLoading) {
    return (
      <RouteLoader label="Checking admin access..." />
    );
  }

  const hasToken = Boolean(getAdminToken());

  if (!isAdminAuthenticated && !hasToken) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}
