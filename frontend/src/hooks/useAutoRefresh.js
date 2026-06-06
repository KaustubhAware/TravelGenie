import { useCallback, useEffect, useRef, useState } from "react";

export function useAutoRefresh(loader, options = {}) {
  const {
    intervalMs = 60000,
    enabled = true,
    immediate = true,
    focusThrottleMs = 15000,
  } = options;

  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState("");
  const mountedRef = useRef(false);
  const loaderRef = useRef(loader);
  const inFlightRef = useRef(false);
  const lastRefreshRef = useRef(0);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!enabled || inFlightRef.current) return;

    inFlightRef.current = true;
    lastRefreshRef.current = Date.now();

    try {
      if (!silent && mountedRef.current) setLoading(true);
      if (mountedRef.current) setError("");
      await loaderRef.current?.({ silent });
    } catch (err) {
      if (mountedRef.current) {
        setError(err?.message || "Refresh failed");
      }
    } finally {
      inFlightRef.current = false;
      if (!silent && mountedRef.current) setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled) {
      mountedRef.current = false;
      return undefined;
    }

    if (immediate) {
      refresh();
    }

    const safeIntervalMs = Math.max(intervalMs, 15000);

    const id = window.setInterval(() => {
      if (mountedRef.current && document.visibilityState === "visible") {
        refresh({ silent: true });
      }
    }, safeIntervalMs);

    const onFocus = () => {
      const elapsed = Date.now() - lastRefreshRef.current;
      if (elapsed >= focusThrottleMs) {
        refresh({ silent: true });
      }
    };
    window.addEventListener("focus", onFocus);

    return () => {
      mountedRef.current = false;
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled, focusThrottleMs, immediate, intervalMs, refresh]);

  return { loading, error, refresh };
}
