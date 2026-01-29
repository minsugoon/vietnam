// Service Worker (sw.js)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // PWA 설치 요건을 충족하기 위한 빈 fetch 핸들러
});