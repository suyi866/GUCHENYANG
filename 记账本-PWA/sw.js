const CACHE = "jzb-v1";
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(ASSETS.map((a) => c.add(a)))).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => { const req = e.request; if (req.method !== "GET") return;
  if (req.mode === "navigate") { e.respondWith(fetch(req).then((res) => { const clone = res.clone(); caches.open(CACHE).then((c) => c.put("./index.html", clone)); return res; }).catch(() => caches.match("./index.html"))); return; }
  e.respondWith(caches.match(req).then((cached) => { const network = fetch(req).then((res) => { if (res && res.status === 200) { const clone = res.clone(); caches.open(CACHE).then((c) => c.put(req, clone)); } return res; }).catch(() => cached); return cached || network; }));
});
