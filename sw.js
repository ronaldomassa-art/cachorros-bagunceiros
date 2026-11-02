// Cachorros Bagunceiros: sempre busca a versão mais nova na internet;
// sem internet, usa a cópia guardada no celular.
const CACHE = "bagunceiros-v2";
const BASE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)));
});
self.addEventListener("activate", e => {
  // apaga cópias de versões antigas
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, {cache: "no-store"})
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match("./index.html")))
  );
});
