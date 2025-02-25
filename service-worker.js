const CACHE_NAME = 'tgw-search-v1'; // 更新版本号
const urlsToCache = [
  '/tgw-search/',
  '/tgw-search/index.html',
  '/tgw-search/manifest.json',
  '/tgw-search/favicon.ico',
  '/tgw-search/icon-16.png',
  '/tgw-search/icon-32.png',
  '/tgw-search/icon-192.png',
  '/tgw-search/icon-512.png',
  '/tgw-search/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 添加缓存清理逻辑
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果找到缓存的响应，返回它
        if (response) {
          return response;
        }
        // 否则发起网络请求
        return fetch(event.request).then(
          response => {
            // 检查是否是有效的响应
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // 克隆响应，因为响应流只能使用一次
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
