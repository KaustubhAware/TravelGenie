import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../../firebase";

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
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            setAuthState("guest");
            return;
          }

          try {
            const token =
              await user.getIdToken();

            if (token) {
              localStorage.setItem(
                "token",
                token
              );
            }
          } catch {
            // Keep existing token
          }

          setAuthState(
            hasAuthToken()
              ? "authenticated"
              : "guest"
          );
        }
      );

    return () => unsubscribe();
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