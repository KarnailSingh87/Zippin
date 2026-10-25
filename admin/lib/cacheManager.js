/**
 * Automated Cache & Memory Management System (Admin Panel)
 * - Automatically purges expired cache keys on interval
 * - Cleans transient memory caches upon website refresh
 * - Enforces Time-To-Live (TTL) on cached metrics & dashboard data
 */

const CACHE_PREFIX = "zippin_admin_cache_";
const DEFAULT_TTL_SECONDS = 15 * 60; // 15 minutes

export const cacheManager = {
  set(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
    if (typeof window === "undefined") return;
    try {
      const entry = {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      console.warn("Admin cache write failed:", e);
    }
  },

  get(key) {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return entry.value;
    } catch {
      return null;
    }
  },

  purgeExpired() {
    if (typeof window === "undefined") return;
    try {
      const now = Date.now();
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          try {
            const entry = JSON.parse(localStorage.getItem(k));
            if (entry && entry.expiresAt && now > entry.expiresAt) {
              keysToRemove.push(k);
            }
          } catch {
            keysToRemove.push(k);
          }
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn("Admin cache purge error:", e);
    }
  },

  purgeOnRefresh() {
    if (typeof window === "undefined") return;
    try {
      const navEntries = performance.getEntriesByType?.("navigation");
      const isReload =
        (navEntries && navEntries[0]?.type === "reload") ||
        (window.performance && window.performance.navigation && window.performance.navigation.type === 1);

      if (isReload) {
        const transientPrefixes = ["dash_", "metrics_", "temp_", "filter_"];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (transientPrefixes.some((p) => k.includes(p)) || k.startsWith(CACHE_PREFIX))) {
            localStorage.removeItem(k);
          }
        }
        sessionStorage.clear();
        if ("caches" in window) {
          window.caches.keys().then((names) => {
            names.forEach((name) => {
              if (name.includes("admin") || name.includes("temp")) {
                window.caches.delete(name);
              }
            });
          }).catch(() => {});
        }
        console.log("⚡ Admin Dashboard refreshed: Transient cache memory successfully evicted.");
      }
    } catch (e) {
      console.warn("Admin refresh cache clear error:", e);
    }
  },

  initAutoEviction(intervalMs = 10 * 60 * 1000) {
    if (typeof window === "undefined") return;
    this.purgeOnRefresh();
    this.purgeExpired();
    setInterval(() => {
      this.purgeExpired();
    }, intervalMs);
  },
};
