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

export default function UserProtectedRoute({
  children,
}) {
  const [authState, setAuthState] =
    useState("loading");

  const location =
    useLocation();

  useEffect(() => {
    setAuthState(
      hasAuthToken()
        ? "authenticated"
        : "guest"
    );
  }, []);

  if (authState === "loading") {
    return (
      <RouteLoader label="Checking authentication..." />
    );
  }

  if (
    authState !== "authenticated"
  ) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  return children;
}
