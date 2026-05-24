import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import RouteLoader from "../../components/RouteLoader";

export default function AdminProtectedRoute({
  children,
}) {

  const [isValid, setIsValid] =
    useState(null);

  useEffect(() => {

    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token");

    if (token) {

      setIsValid(true);

    } else {

      setIsValid(false);

    }

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