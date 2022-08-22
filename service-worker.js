// service-worker.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});

// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(event) {});

// プッシュ通知手動イベント
self.addEventListener('notificationclick', function(event){
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();
});
