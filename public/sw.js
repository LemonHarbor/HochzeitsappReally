// Service Worker for Wedding Planner PWA
const CACHE_NAME = "wedding-planner-v2";
const STATIC_CACHE_NAME = "wedding-planner-static-v2";
const DYNAMIC_CACHE_NAME = "wedding-planner-dynamic-v2";
const DATA_CACHE_NAME = "wedding-planner-data-v2";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-192x192.png",
];

// API routes that should be cached differently
const API_ROUTES = ["/api/", "https://api.supabase.co"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...");

  // Skip waiting to activate immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Precaching App Shell");
      return cache.addAll(STATIC_ASSETS);
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker...");

  // Claim clients to control all open tabs
  self.clients.claim();

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (
            key !== STATIC_CACHE_NAME &&
            key !== DYNAMIC_CACHE_NAME &&
            key !== DATA_CACHE_NAME
          ) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );

  return self.clients.claim();
});

// Helper function to determine if a request is for an API
function isApiRequest(url) {
  return API_ROUTES.some((route) => url.includes(route));
}

// Helper function to determine if a request is for an HTML page
function isHtmlRequest(request) {
  return request.headers.get("accept")?.includes("text/html");
}

// Fetch event - handle network requests
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle API requests with network-first strategy
  if (isApiRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const clonedResponse = response.clone();

          caches.open(DATA_CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });

          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        }),
    );
    return;
  }

  // For HTML navigation requests, use network-first with fallback to offline page
  if (isHtmlRequest(event.request) && event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // If offline, try to serve cached version of the page
          return caches.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            // If no cached version, serve the offline page
            return caches.match("/");
          });
        }),
    );
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If fetch fails and we don't have a cached response,
          // we could return a custom offline asset here
          if (
            event.request.url.indexOf(".jpg") > -1 ||
            event.request.url.indexOf(".png") > -1 ||
            event.request.url.indexOf(".svg") > -1
          ) {
            return caches.match("/icons/icon-128x128.png");
          }

          // For other resources, just fail
          return new Response("Not available offline", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
    }),
  );
});

// Background sync event
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Background Syncing", event.tag);

  if (event.tag === "sync-guest-data") {
    event.waitUntil(
      // Here you would implement the logic to sync data from IndexedDB to your backend
      // For now, we'll just log it
      console.log("[Service Worker] Syncing guest data"),
    );
  }

  if (event.tag === "sync-table-changes") {
    event.waitUntil(console.log("[Service Worker] Syncing table changes"));
  }
});

// Push notification event
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Notification received", event);

  let data = {
    title: "New Event",
    content: "Something happened!",
    openUrl: "/",
  };

  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  const options = {
    body: data.content,
    icon: "/icons/icon-96x96.png",
    badge: "/icons/icon-72x72.png",
    data: {
      url: data.openUrl,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;
  const url = notification.data.url;

  console.log("[Service Worker] Notification click", action);

  notification.close();

  event.waitUntil(
    clients.matchAll().then((clis) => {
      const client = clis.find((c) => c.visibilityState === "visible");
      if (client) {
        client.navigate(url);
        client.focus();
      } else {
        clients.openWindow(url);
      }
    }),
  );
});
