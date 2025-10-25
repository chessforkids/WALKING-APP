const CACHE_VERSION = "iwc-v1";
const ASSETS = [
"./",
"./index.html",
"./manifest.webmanifest",
"./assets/icon-192.png",
"./assets/icon-512.png"
];

self.addEventListener("install", e => {
e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
)
);
});

self.addEventListener("fetch", e => {
e.respondWith(
caches.match(e.request).then(hit => {
if (hit) return hit;
return fetch(e.request).then(res => {
const copy = res.clone();
caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
return res;
}).catch(() => caches.match("./index.html"));
})
);
});
