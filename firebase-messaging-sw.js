importScripts("https://www.gstatic.com/firebasejs/9.9.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.9.3/firebase-messaging-compat.js");
//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app-compat.js";
//import { getMessaging, onMessage, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-messaging-compat.js";

// firebase-messaging-sw.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});

// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(event) {});

// 通知メッセージ内のアクションボタン押下時の動作
self.addEventListener('notificationclick', function(event){
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();
});

// 通知を受けとると push イベントが呼び出される。:画面がフォアグランドの時は通知されない

self.addEventListener('push', function (payload) {
  console.log("pushイベント開始");
  let data = {};
  if (payload.data) {
    data = payload.data.json();
  }
  const notificationTitle = data.title;
  const notificationOptions = {
    body: data.body,
    // icon: payload.data.icon,
    // vibrate: [300, 100, 100, 100, 300],
    actions: [{
      action: 'action1',
      title: 'アクション1'
    }]
  };

  const notificationPromise = self.registration.showNotification(notificationTitle,
    notificationOptions);

  payload.waitUntil(notificationPromise);

}, false);



// プッシュ通知受信関連
// Firebase利用準備
/*
const firebaseConfig = {
  apiKey: "AIzaSyBtaHO8O-po6GNyDrVxdoxRLF_WF00g5LM",
  authDomain: "test-pwa-push-93537.firebaseapp.com",
  projectId: "test-pwa-push-93537",
  storageBucket: "test-pwa-push-93537.appspot.com",
  messagingSenderId: "558599803051",
  appId: "1:558599803051:web:44c6bda74aa82a855227ee",
  measurementId: "G-27QSMESKFE"
};

// Initialize Firebase
const app =  firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

 */

// バックグラウンドでのプッシュ通知受信
/*
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = payload.notification.title; // タイトル
  var notificationOptions = {
    body: payload.notification.body, // 本文
    icon: payload.notification.icon, // アイコン
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

 */



