import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { env } from "../config/env";
import { getAuthToken } from "../utils/authToken";
import RouteLoader from "./RouteLoader";

export default function AdminProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const token = getAuthToken();

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await fetch(`${env.API_BASE_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setIsValid(true);
        } else {
          localStorage.removeItem("token");
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      }
    };

    verify();
  }, []);

  if (isValid === null) {
    return <RouteLoader label="Checking admin access..." />;
  }

  return isValid ? children : <Navigate to="/admin/login" replace />;
}
