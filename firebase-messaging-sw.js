//import { initializeApp } from "firebase/app";
//import { getMessaging } from "firebase/messaging/sw";
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js');

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

// 通知を受けとると push イベントが呼び出される。
/*
self.addEventListener('push', function (payload) {
  console.log("pushイベント開始");
  var data = {};
  if (payload.data) {
    data = payload.data.json();
  }
  const notificationTitle = data.data.title;
  const notificationOptions = {
    body: data.data.message,
    tag: data.data.tag,
    icon: '/abacus/test/icon.png',
    vibrate: [300, 100, 100, 100, 300],
    actions: [{
      action: 'action1',
      title: 'アクション1'
    }
    ]
  };

  const notificationPromise = self.registration.showNotification(notificationTitle,
    notificationOptions);

  payload.waitUntil(notificationPromise);

}, false);
 */

// プッシュ通知受信関連
// Firebase利用準備

//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app-compat.js";
//import { getMessaging, onMessage, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-messaging-compat.js";

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

// フォアグラウンドでのプッシュ通知受信
messaging.onMessage(function(payload){
  var notificationTitle = payload.data.title; // タイトル
  var notificationOptions = {
    body: payload.data.body, // 本文
    icon: '/icon.png', // アイコン
    click_action: 'https://xxxx.sample.com/' // 飛び先URL
  };

  if (!("Notification" in window)) {
    // ブラウザが通知機能に対応しているかを判定
  } else if (Notification.permission === "granted") {
    // 通知許可されていたら通知する
    var notification = new Notification(notificationTitle,notificationOptions);
  }
});

// バックグラウンドでのプッシュ通知受信
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


