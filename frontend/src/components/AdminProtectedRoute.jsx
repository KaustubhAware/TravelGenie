import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/stats", {
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

  if (isValid === null) return <p>Checking admin...</p>;

  return isValid ? children : <Navigate to="/admin/login" />;
}
