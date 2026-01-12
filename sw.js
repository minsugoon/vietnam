const CACHE_NAME = "vn-btn-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw.js"
];

// 설치: 핵심 파일 캐시
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 활성화: 이전 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// 요청 처리: 
// - 페이지 이동(navigate)은 무조건 index.html로 캐시 폴백
// - 그 외는 캐시 우선, 없으면 네트워크
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // 페이지 이동 요청이면 index.html 캐시로 폴백
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((cached) => cached || fetch(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => cached);
    })
  );
});
