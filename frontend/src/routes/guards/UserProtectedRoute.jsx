import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import RouteLoader from "../../components/RouteLoader";

import {
  hasAuthToken,
} from "../../utils/authToken";
import { apiRequest } from "../../services/httpClient";

export default function UserProtectedRoute({
  children,
  roles = [],
}) {
  const [authState, setAuthState] =
    useState("loading");
  const [currentRole, setCurrentRole] =
    useState("");

  const location =
    useLocation();

  const roleKey = roles.join("|");

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (!hasAuthToken()) {
        if (mounted) {
          setAuthState("guest");
        }
        return;
      }

      if (roles.length === 0) {
        if (mounted) {
          setAuthState("authenticated");
        }
        return;
      }

      try {
        const res = await apiRequest("/auth/me", {
          skipAuthRedirect: true,
        });
        const authUser = res.data?.user || {};
        const role = authUser.role || "customer";
        const vendorAllowed =
          role !== "vendor" ||
          !roles.includes("vendor") ||
          authUser.vendor_status === "approved";
        if (mounted) {
          setCurrentRole(role);
          setAuthState(
            roles.includes(role) && vendorAllowed
              ? "authenticated"
              : "forbidden"
          );
        }
      } catch {
        if (mounted) {
          setAuthState("guest");
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [roleKey]);

  if (authState === "loading") {
    return (
      <RouteLoader label="Checking authentication..." />
    );
  }

  if (
    authState !== "authenticated"
  ) {
    if (authState === "forbidden") {
      const fallbackPath =
        currentRole === "vendor"
          ? "/vendor/login"
          : currentRole === "admin"
            ? "/admin"
            : "/dashboard";

      return (
        <Navigate
          to={fallbackPath}
          replace
        />
      );
    }

    return (
      <Navigate
        to={
          location.pathname.startsWith("/vendor")
            ? "/vendor/login"
            : "/login"
        }
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  return children;
}
