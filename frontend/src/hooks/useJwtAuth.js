import { useMemo } from "react";

import { useAuth } from "../context/AuthContext";
import { getUserToken } from "../utils/authToken";

export function useJwtAuth() {
  const {
    authLoading,
    userInitialized,
    user,
    isAuthenticated,
  } = useAuth();

  const token = getUserToken();

  return useMemo(() => {
    const sessionActive = isAuthenticated && Boolean(token);

    return {
      user: sessionActive
        ? {
            ...(user || {}),
            getIdToken: async () => token,
          }
        : null,
      authReady: userInitialized && !authLoading,
      token,
      isAuthenticated: sessionActive,
      userId: user?.id ?? null,
    };
  }, [
    authLoading,
    isAuthenticated,
    token,
    user?.email,
    user?.id,
    user?.role,
    userInitialized,
  ]);
}
