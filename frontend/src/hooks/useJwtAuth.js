import { useEffect, useState } from "react";
import { getAuthToken } from "../utils/authToken";

export function useJwtAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setUser(token ? { getIdToken: async () => token } : null);
    setAuthReady(true);
  }, []);

  return { user, authReady };
}
