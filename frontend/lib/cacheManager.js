/**
 * Automated Cache & Memory Management System
 * - Automatically purges expired cache keys on interval
 * - Cleans transient memory caches upon website refresh
 * - Enforces Time-To-Live (TTL) on cached product data & searches
 */

const CACHE_PREFIX = "zippin_cache_";
const DEFAULT_TTL_SECONDS = 30 * 60; // 30 minutes

export const cacheManager = {
  /**
   * Set item in cache with expiration timestamp
   */
  set(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
    if (typeof window === "undefined") return;
    try {
      const entry = {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      console.warn("Cache write failed:", e);
    }
  },

  /**
   * Get item from cache if not expired; automatically deletes if expired
   */
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

  /**
   * Purge expired cache entries
   */
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
      console.warn("Cache purge error:", e);
    }
  },

  /**
   * Called on page refresh to flush transient cache memory
   */
  purgeOnRefresh() {
    if (typeof window === "undefined") return;
    try {
      const navEntries = performance.getEntriesByType?.("navigation");
      const isReload =
        (navEntries && navEntries[0]?.type === "reload") ||
        (window.performance && window.performance.navigation && window.performance.navigation.type === 1);

      if (isReload) {
        // Flush volatile search & catalog memory caches on page refresh
        const transientPrefixes = ["search_", "catalog_", "temp_", "geo_"];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (transientPrefixes.some((p) => k.includes(p)) || k.startsWith(CACHE_PREFIX))) {
            localStorage.removeItem(k);
          }
        }
        sessionStorage.clear();
        if (typeof window !== "undefined" && "caches" in window) {
          window.caches
            .keys()
            .then((names) => {
              names.forEach((name) => {
                if (name.includes("zippin") || name.includes("temp") || name.includes("catalog")) {
                  window.caches.delete(name);
                }
              });
            })
            .catch(() => {});
        }
        console.log("⚡ Website refreshed: Transient cache memory successfully evicted.");
      }
    } catch (e) {
      console.warn("Refresh cache clear error:", e);
    }
  },

  /**
   * Initialize background periodic auto-cleanup
   */
  initAutoEviction(intervalMs = 10 * 60 * 1000) {
    if (typeof window === "undefined") return;
    this.purgeOnRefresh();
    this.purgeExpired();
    setInterval(() => {
      this.purgeExpired();
    }, intervalMs);
  },
};
