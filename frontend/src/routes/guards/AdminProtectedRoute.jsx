import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import RouteLoader from "../../components/RouteLoader";
import { apiRequest } from "../../services/httpClient";

export default function AdminProtectedRoute({
  children,
}) {

  const [isValid, setIsValid] =
    useState(null);

  useEffect(() => {

    let mounted = true;

    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token");

    const checkAdmin = async () => {
      if (!token) {
        if (mounted) {
          setIsValid(false);
        }
        return;
      }

      try {
        await apiRequest("/admin/stats", {
          skipAuthRedirect: true,
        });
        if (mounted) {
          setIsValid(true);
        }
      } catch {
        if (mounted) {
          setIsValid(false);
        }
      }
    };

    checkAdmin();

    return () => {
      mounted = false;
    };

  }, []);

  if (isValid === null) {

    return (
      <RouteLoader label="Checking admin access..." />
    );

  }

  return isValid

    ? children

    : (
      <Navigate
        to="/admin/login"
        replace
      />
    );

}
