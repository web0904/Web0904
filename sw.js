const CACHE = 'rt09rw04-v7';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE)
    .then(function(c) { return c.addAll(ASSETS).catch(function(err) { console.warn('Cache addAll err:', err); }); })
    .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
        .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url;
  try { url = new URL(e.request.url); } catch(err) { return; }

  // Skip Firebase Auth (harus network)
  if (url.hostname.indexOf('identitytoolkit') > -1 ||
      url.hostname.indexOf('securetoken') > -1 ||
      url.hostname.indexOf('firestore.googleapis.com') > -1) {
    return;
  }

  // Skip non-http (chrome-extension, dsb)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // HTML & manifest → network-first
  if (url.origin === location.origin && (
      url.pathname.endsWith('/') ||
      url.pathname.indexOf('.html') > -1 ||
      url.pathname.indexOf('.json') > -1)) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // Asset statis → cache-first
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      });
    })
  );
});
