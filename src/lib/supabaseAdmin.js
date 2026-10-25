import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

// High-speed in-memory cache for read queries (30-second TTL)
const queryCache = new Map();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

export function invalidateAdminCache() {
  queryCache.clear();
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
  global: {
    fetch: async (url, options = {}) => {
      const method = (options.method || "GET").toUpperCase();

      // If writing or mutating, immediately clear read cache so fresh data is loaded
      if (method !== "GET" && method !== "HEAD") {
        queryCache.clear();
        return fetch(url, options);
      }

      // Read queries: check in-memory cache
      const cacheKey = `${url}|${options.headers?.Range || ""}|${options.headers?.Prefer || ""}`;
      const cached = queryCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers: new Headers(cached.headers),
        });
      }

      const res = await fetch(url, {
        ...options,
        next: { revalidate: 30 },
      });

      if (res.ok) {
        try {
          const bodyText = await res.text();
          const headersObj = {};
          res.headers.forEach((val, key) => {
            headersObj[key] = val;
          });

          queryCache.set(cacheKey, {
            body: bodyText,
            status: res.status,
            statusText: res.statusText,
            headers: headersObj,
            timestamp: Date.now(),
          });

          return new Response(bodyText, {
            status: res.status,
            statusText: res.statusText,
            headers: new Headers(headersObj),
          });
        } catch {
          return res;
        }
      }

      return res;
    },
  },
});
