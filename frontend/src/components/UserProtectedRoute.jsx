import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function UserProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe(); // ✅ cleanup (important)
  }, []);

  // 🔄 Better loading UI (SaaS feel)
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // 🔐 Not logged in → go to login (with memory)
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ✅ Logged in
  return children;
}