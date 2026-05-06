const CACHE_NAME = "gh-marathon-v2";
const RUNTIME_CACHE = "gh-runtime-v2";

const CORE_ASSETS = ["./", "./index.html", "./app.js", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CORE_ASSETS);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Navigation: serve cached index.html fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const network = await fetch(req);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(req, network.clone());
          return network;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match("./index.html");
          return cached || Response.error();
        }
      })(),
    );
    return;
  }

  // Same-origin: network-first for HTML/JS/manifest to avoid stale UI.
  if (url.origin === self.location.origin) {
    const path = url.pathname;
    const isNetworkFirst =
      path.endsWith("/index.html") ||
      path.endsWith("/app.js") ||
      path.endsWith("/manifest.json") ||
      path === "/";

    if (isNetworkFirst) {
      event.respondWith(
        (async () => {
          const cache = await caches.open(RUNTIME_CACHE);
          try {
            const res = await fetch(req);
            cache.put(req, res.clone());
            return res;
          } catch {
            const cached = await caches.match(req);
            return cached || Response.error();
          }
        })(),
      );
      return;
    }

    // Cache-first for other same-origin assets.
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, res.clone());
        return res;
      })(),
    );
    return;
  }

  // Runtime cache for CDN assets (Tailwind).
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, res.clone());
        return res;
      } catch {
        return cached || Response.error();
      }
    })(),
  );
});
