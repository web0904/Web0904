// ==== FCM SETUP ====
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCEttPAa6glm2qHUw3_QIcj2C8qqB9ZwOI",
  authDomain: "spark-61d51.firebaseapp.com",
  projectId: "spark-61d51",
  storageBucket: "spark-61d51.firebasestorage.app",
  messagingSenderId: "618121526268",
  appId: "1:618121526268:web:439521109a847c9ec25079"
});

var messaging = firebase.messaging();

// Handle notifikasi saat app di background/tertutup
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message:', payload);
  var title = (payload.notification && payload.notification.title) || 'RT09 RW04';
  var body = (payload.notification && payload.notification.body) || 'Ada aktivitas baru';
  var icon = (payload.notification && payload.notification.icon) || './icon-192.png';
  var options = {
    body: body,
    icon: icon,
    badge: './icon-192.png',
    vibrate: [200, 100, 200],
    tag: (payload.data && payload.data.tag) || 'default',
    data: payload.data || {},
    requireInteraction: false
  };
  return self.registration.showNotification(title, options);
});

// Klik notifikasi → buka / fokus ke app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var urlToOpen = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(self.location.origin) === 0 && 'focus' in list[i]) {
          return list[i].focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});

// ==== CACHE ====
const CACHE = 'rt09rw04-v13';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE)
    .then(function(c) { return c.addAll(ASSETS).catch(function() {}); })
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
  try { url = new URL(e.request.url); } catch (err) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (url.hostname.indexOf('identitytoolkit') > -1 || url.hostname.indexOf('securetoken') > -1) return;
  if (url.hostname.indexOf('fcm.googleapis.com') > -1) return;
  if (url.hostname.indexOf('firebaseinstallations') > -1) return;
  if (url.hostname.indexOf('firestore.googleapis.com') > -1) return;
  
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function() {
        return caches.match('./index.html');
      });
    })
  );
});
