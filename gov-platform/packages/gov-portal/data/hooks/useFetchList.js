import React from "react";
import { getCache, setCache } from "../cache-keys/cache.js";

export function useFetchList(key, fetcher, deps = []) {
  const [state, setState] = React.useState(() => ({
    loading: !getCache(key),
    error: null,
    data: getCache(key) || [],
  }));

  React.useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    (async () => {
      try {
        const data = await fetcher({ signal: controller.signal });
        if (!mounted) return;
        setCache(key, data);
        setState({ loading: false, error: null, data });
      } catch (err) {
        if (!mounted || err.name === "AbortError") return;
        setState((s) => ({ ...s, loading: false, error: err }));
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}