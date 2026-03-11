const CACHE_VERSION = "lifeuk-static-9c3bb89c3c";
const APP_SHELL = [
  "./",
  "./index.html",
  "./assets/app.9c3bb89c3c.js",
  "./robots.txt",
  "./sitemap.xml",
];
const NETWORK_FIRST_PATHS = new Set([
  "/",
  "/index.html",
  "/assets/app.9c3bb89c3c.js",
]);

const CDN_ASSETS = [
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js",
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      await Promise.all(CDN_ASSETS.map(async (url) => {
        try {
          await cache.add(url);
        } catch (err) {
          // Ignore individual CDN cache failures during install.
        }
      }));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isCdnAsset = CDN_ASSETS.includes(url.href);
  const path = url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put("./index.html", copy));
        return response;
      }).catch(async () => {
        const cached = await caches.match("./index.html");
        return cached || Response.error();
      })
    );
    return;
  }

  if (!isSameOrigin && !isCdnAsset) return;

  if (isSameOrigin && NETWORK_FIRST_PATHS.has(path)) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(async () => {
        const cached = await caches.match(event.request);
        return cached || Response.error();
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});
