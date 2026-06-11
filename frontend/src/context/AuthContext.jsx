import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import { apiRequest } from "../services/httpClient";
import {
  clearAdminAuth,
  clearUserAuth,
  debugAuth,
  getAdminToken,
  getAuthScopeFromPath,
  getPersistedAdminRole,
  getPersistedAuthUser,
  getPersistedRole,
  getUserToken,
  isInvalidTokenDetail,
  persistAuthUser,
} from "../utils/authToken";

const AuthContext = createContext(null);

const sameUserAuth = (left, right) =>
  left.initialized === right.initialized &&
  left.loading === right.loading &&
  left.isAuthenticated === right.isAuthenticated &&
  left.role === right.role &&
  left.user?.id === right.user?.id &&
  left.user?.email === right.user?.email &&
  left.user?.role === right.user?.role;

const sameAdminAuth = (left, right) =>
  left.initialized === right.initialized &&
  left.loading === right.loading &&
  left.isAuthenticated === right.isAuthenticated &&
  left.role === right.role;

const restoreUserFromStorage = () => ({
  user: getPersistedAuthUser(),
  role: getPersistedRole() || "customer",
});

const restoreAdminFromStorage = () => ({
  role: getPersistedAdminRole() || "admin",
});

export function AuthProvider({ children }) {
  const location = useLocation();
  const userRestoreRef = useRef(null);
  const adminRestoreRef = useRef(null);
  const userBootstrappedRef = useRef(!getUserToken());
  const adminBootstrappedRef = useRef(!getAdminToken());
  const lastScopeRef = useRef("");

  const [userAuth, setUserAuth] = useState(() => ({
    initialized: !getUserToken(),
    loading: Boolean(getUserToken()),
    user: getPersistedAuthUser(),
    role: getPersistedRole() || "",
    isAuthenticated: Boolean(getUserToken()),
  }));

  const [adminAuth, setAdminAuth] = useState(() => ({
    initialized: !getAdminToken(),
    loading: Boolean(getAdminToken()),
    role: getPersistedAdminRole() || "admin",
    isAuthenticated: Boolean(getAdminToken()),
  }));

  const commitUserAuth = useCallback((next, source) => {
    setUserAuth((current) => {
      if (sameUserAuth(current, next)) {
        return current;
      }

      debugAuth("userAuth:transition", {
        source,
        from: {
          initialized: current.initialized,
          loading: current.loading,
          isAuthenticated: current.isAuthenticated,
          role: current.role,
          userId: current.user?.id ?? null,
        },
        to: {
          initialized: next.initialized,
          loading: next.loading,
          isAuthenticated: next.isAuthenticated,
          role: next.role,
          userId: next.user?.id ?? null,
        },
      });

      return next;
    });
  }, []);

  const commitAdminAuth = useCallback((next, source) => {
    setAdminAuth((current) => {
      if (sameAdminAuth(current, next)) {
        return current;
      }

      debugAuth("adminAuth:transition", {
        source,
        from: {
          initialized: current.initialized,
          loading: current.loading,
          isAuthenticated: current.isAuthenticated,
          role: current.role,
        },
        to: {
          initialized: next.initialized,
          loading: next.loading,
          isAuthenticated: next.isAuthenticated,
          role: next.role,
        },
      });

      return next;
    });
  }, []);

  const hydrateUserFromStorage = useCallback((source = "unknown") => {
    const token = getUserToken();

    if (!token) {
      userBootstrappedRef.current = true;
      commitUserAuth({
        initialized: true,
        loading: false,
        user: null,
        role: "",
        isAuthenticated: false,
      }, `${source}:guest`);
      return;
    }

    const persisted = restoreUserFromStorage();
    userBootstrappedRef.current = true;

    commitUserAuth({
      initialized: true,
      loading: false,
      user: persisted.user,
      role: persisted.role,
      isAuthenticated: true,
    }, `${source}:storage`);
  }, [commitUserAuth]);

  const hydrateAdminFromStorage = useCallback((source = "unknown") => {
    const token = getAdminToken();

    if (!token) {
      adminBootstrappedRef.current = true;
      commitAdminAuth({
        initialized: true,
        loading: false,
        role: "",
        isAuthenticated: false,
      }, `${source}:guest`);
      return;
    }

    const persisted = restoreAdminFromStorage();
    adminBootstrappedRef.current = true;

    commitAdminAuth({
      initialized: true,
      loading: false,
      role: persisted.role,
      isAuthenticated: true,
    }, `${source}:storage`);
  }, [commitAdminAuth]);

  const restoreUserSession = useCallback(async (source = "unknown") => {
    if (userRestoreRef.current) {
      return userRestoreRef.current;
    }

    const run = (async () => {
      const token = getUserToken();
      const isBootstrap = !userBootstrappedRef.current;

      debugAuth("restoreUser:start", { source, hasToken: Boolean(token), isBootstrap });

      if (!token) {
        userBootstrappedRef.current = true;
        commitUserAuth({
          initialized: true,
          loading: false,
          user: null,
          role: "",
          isAuthenticated: false,
        }, `${source}:guest`);
        return;
      }

      if (isBootstrap) {
        commitUserAuth({
          initialized: false,
          loading: true,
          user: getPersistedAuthUser(),
          role: getPersistedRole() || "customer",
          isAuthenticated: true,
        }, `${source}:bootstrap`);
      }

      try {
        const res = await apiRequest("/auth/me", {
          skipAuthRedirect: true,
        });
        const authUser = res.data?.user || {};

        persistAuthUser(authUser, { notify: false });
        userBootstrappedRef.current = true;

        commitUserAuth({
          initialized: true,
          loading: false,
          user: authUser,
          role: authUser.role || "customer",
          isAuthenticated: true,
        }, `${source}:success`);
      } catch (error) {
        if (error?.status === 401 && isInvalidTokenDetail(error.detail)) {
          clearUserAuth({ notify: false });
          userBootstrappedRef.current = true;
          commitUserAuth({
            initialized: true,
            loading: false,
            user: null,
            role: "",
            isAuthenticated: false,
          }, `${source}:invalid-token`);
          return;
        }

        const persisted = restoreUserFromStorage();
        userBootstrappedRef.current = true;

        commitUserAuth({
          initialized: true,
          loading: false,
          user: persisted.user,
          role: persisted.role,
          isAuthenticated: Boolean(getUserToken()),
        }, `${source}:fallback`);
      }
    })();

    userRestoreRef.current = run;

    try {
      await run;
    } finally {
      userRestoreRef.current = null;
    }
  }, [commitUserAuth]);

  const restoreAdminSession = useCallback(async (source = "unknown") => {
    if (adminRestoreRef.current) {
      return adminRestoreRef.current;
    }

    const run = (async () => {
      const token = getAdminToken();
      const isBootstrap = !adminBootstrappedRef.current;

      debugAuth("restoreAdmin:start", { source, hasToken: Boolean(token), isBootstrap });

      if (!token) {
        adminBootstrappedRef.current = true;
        commitAdminAuth({
          initialized: true,
          loading: false,
          role: "",
          isAuthenticated: false,
        }, `${source}:guest`);
        return;
      }

      if (isBootstrap) {
        commitAdminAuth({
          initialized: false,
          loading: true,
          role: getPersistedAdminRole() || "admin",
          isAuthenticated: true,
        }, `${source}:bootstrap`);
      }

      try {
        await apiRequest("/admin/stats", {
          skipAuthRedirect: true,
        });

        adminBootstrappedRef.current = true;
        commitAdminAuth({
          initialized: true,
          loading: false,
          role: "admin",
          isAuthenticated: true,
        }, `${source}:success`);
      } catch (error) {
        if (error?.status === 401 && isInvalidTokenDetail(error.detail)) {
          clearAdminAuth({ notify: false });
          adminBootstrappedRef.current = true;
          commitAdminAuth({
            initialized: true,
            loading: false,
            role: "",
            isAuthenticated: false,
          }, `${source}:invalid-token`);
          return;
        }

        const persisted = restoreAdminFromStorage();
        adminBootstrappedRef.current = true;

        commitAdminAuth({
          initialized: true,
          loading: false,
          role: persisted.role,
          isAuthenticated: Boolean(getAdminToken()),
        }, `${source}:fallback`);
      }
    })();

    adminRestoreRef.current = run;

    try {
      await run;
    } finally {
      adminRestoreRef.current = null;
    }
  }, [commitAdminAuth]);

  useEffect(() => {
    const scope = getAuthScopeFromPath(location.pathname);

    debugAuth("route:scope", {
      pathname: location.pathname,
      scope,
      previousScope: lastScopeRef.current,
    });

    lastScopeRef.current = scope;

    if (scope === "user") {
      restoreUserSession("route:user");
      hydrateAdminFromStorage("route:inactive-admin");
      return;
    }

    if (scope === "admin") {
      restoreAdminSession("route:admin");
      hydrateUserFromStorage("route:inactive-user");
      return;
    }

    hydrateUserFromStorage("route:public-user");
    hydrateAdminFromStorage("route:public-admin");
  }, [
    hydrateAdminFromStorage,
    hydrateUserFromStorage,
    location.pathname,
    restoreAdminSession,
    restoreUserSession,
  ]);

  useEffect(() => {
    const handleUserAuthChange = () => {
      const scope = getAuthScopeFromPath(window.location.pathname);

      if (scope === "user") {
        restoreUserSession("user-auth-changed");
        return;
      }

      hydrateUserFromStorage("user-auth-changed");
    };

    const handleAdminAuthChange = () => {
      const scope = getAuthScopeFromPath(window.location.pathname);

      if (scope === "admin") {
        restoreAdminSession("admin-auth-changed");
        return;
      }

      hydrateAdminFromStorage("admin-auth-changed");
    };

    window.addEventListener("user-auth-changed", handleUserAuthChange);
    window.addEventListener("admin-auth-changed", handleAdminAuthChange);

    return () => {
      window.removeEventListener("user-auth-changed", handleUserAuthChange);
      window.removeEventListener("admin-auth-changed", handleAdminAuthChange);
    };
  }, [
    hydrateAdminFromStorage,
    hydrateUserFromStorage,
    restoreAdminSession,
    restoreUserSession,
  ]);

  const value = useMemo(
    () => ({
      authLoading: !userAuth.initialized || userAuth.loading,
      userInitialized: userAuth.initialized,
      user: userAuth.user,
      role: userAuth.role,
      isAuthenticated: userAuth.isAuthenticated,
      adminAuthLoading: !adminAuth.initialized || adminAuth.loading,
      adminInitialized: adminAuth.initialized,
      adminRole: adminAuth.role,
      isAdminAuthenticated: adminAuth.isAuthenticated,
      restoreUserSession,
      restoreAdminSession,
    }),
    [adminAuth, restoreAdminSession, restoreUserSession, userAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
