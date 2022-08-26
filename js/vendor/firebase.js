  // Import the functions you need from the SDKs you need
  //importScripts('https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js');
  //importScripts('https://www.gstatic.com/firebasejs/9.9.3/firebase-messaging.js');
  //importScripts('https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js');
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
  import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-messaging.js";
  import { getFirestore, collection, getDocs, query, where, doc, setDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const app =  initializeApp(firebaseConfig);

  // FCM使用準備
  const messaging = getMessaging();
  //messaging.usePublicVapidKey('BAII3hZxX3cugdIE-44-qxx40juQDE5gK3XSnZYKXQHeGuIdIVWg4i7qknxo1kr6TFDDa1brAWvqtO0jAfr6pEw');// VAPIDを設定

  // Firestore使用準備
  const db = getFirestore(app);
  const usersRef = collection(db, "users");

  const sw = await window.navigator.serviceWorker.register('/firebase-messaging-sw.js')

  // 購読確認を行う
  checkSubscription();

  // 購読確認処理
  function checkSubscription() {
    //通知の承認を確認
    Notification.requestPermission().then(function() {
      //トークンを確認
      getToken(messaging,{
        vapidKey: 'BAII3hZxX3cugdIE-44-qxx40juQDE5gK3XSnZYKXQHeGuIdIVWg4i7qknxo1kr6TFDDa1brAWvqtO0jAfr6pEw', // ウェブプッシュ証明書のキーを貼り付ける
        serviceWorkerRegistration: sw //サービスワーカを指定（省略するとルートディレクトリのfirebase-messaging-sw.jsを登録しようとする）
      }).then(function(token) {
        //トークン発行
        if (token) {
          //トークンがDBに入っているか確認
          getDocs(query(usersRef, where('token', '==', token))).then(function(oldLog){
          //usersRef.where('token', '==', token).get().then(function(oldLog){
            if(oldLog.empty){
              //入っていなければ購読ボタン表示
              console.log('トークンは登録されていません。');
              $('#notification p.caution').text('通知を購読していません。');
              ShowEntryButton();
            } else {
              //入っていれば購読状況確認
              console.log('トークンはすでに登録されています。');
              oldLog.forEach(function(doc){
                var data = doc.data();
                if(data.subscribe == true){
                  //購読している（＝停止ボタン表示）
                  $('#notification p.caution').text('通知を購読しています。');
                  ShowRemoveButton();
                } else {
                  //購読していない（＝開始ボタン表示）
                  $('#notification p.caution').text('購読を解除しました。');
                  ShowEntryButton();
                }
              });
            }
          });
        } else {
          console.log('通知の承認が得られませんでした。');
          $('#notification p.caution').text('購読を開始できませんでした。');
          ShowEntryButton();
        }
      }).catch(function(err) {
        console.log('トークンを取得できませんでした。', err);
        $('#notification p.caution').text('購読を開始できませんでした。');
        ShowEntryButton();
      });
    }).catch(function (err) {
      //プッシュ通知未対応
      console.log('通知の承認が得られませんでした。', err);
      $('#notification p.caution').text('プッシュ通知が許可されていません。ブラウザの設定を確認してください。');
      ShowEntryButton();
    });
  }

  // 購読処理
  export function getSubscription() {
    console.log("登録関数呼び出された");
    //通知の承認を確認
    Notification.requestPermission().then(function() {
      //トークンを確認
      getToken(messaging,{
        vapidKey: 'BAII3hZxX3cugdIE-44-qxx40juQDE5gK3XSnZYKXQHeGuIdIVWg4i7qknxo1kr6TFDDa1brAWvqtO0jAfr6pEw', // ウェブプッシュ証明書のキーを貼り付ける
        serviceWorkerRegistration: sw //サービスワーカを指定（省略するとルートディレクトリのfirebase-messaging-sw.jsを登録しようとする）
      }).then(function(token) {
        //トークン発行
        if (token) {
          //トークンがDBに入っているか確認
          getDocs(query(usersRef, where('token', '==', token))).then(function(oldLog){
          //usersRef.where('token', '==', token).get().then(function(oldLog){
            if(oldLog.empty){
              //トークン登録がなければトークン登録・購読設定
              setDoc(doc(usersRef),{
                token: token,
                subscribe: true
              });
              // usersRef.add({
              //   token: token,
              //   subscribe: true
              // });
              console.log('トークン新規登録しました。');
            } else {
              //トークン登録があれば購読に設定変更
              oldLog.forEach(function(d){
                console.log('トークンはすでに登録されています。');
                // usersRef.doc(doc.id).update({
                //   subscribe: true
                // })
                updateDoc(doc(usersRef,d.id),{
                  subscribe: true
                })
              });
            }
            //購読解除ボタン表示
            ShowRemoveButton();
          });
          //購読状況表示更新
          $('#notification p.caution').text('通知を購読しています。');
        } else {
          console.log('通知の承認が得られませんでした。');
          $('#notification p.caution').text('購読を開始できませんでした。');
          ShowEntryButton();
        }
      }).catch(function(err) {
        console.log('トークンを取得できませんでした。', err);
        $('#notification p.caution').text('購読を開始できませんでした。');
        ShowEntryButton();
      });
    }).catch(function (err) {
      console.log('通知の承認が得られませんでした。', err);
      $('#notification p.caution').text('プッシュ通知が許可されていません。ブラウザの設定を確認してください。');
      ShowEntryButton();
    });
  }

  // 購読解除処理
  export function removeSubscription() {
    //通知の承認を確認
    Notification.requestPermission().then(function() {
      //トークンを確認
      getToken(messaging,{
        vapidKey: 'BAII3hZxX3cugdIE-44-qxx40juQDE5gK3XSnZYKXQHeGuIdIVWg4i7qknxo1kr6TFDDa1brAWvqtO0jAfr6pEw', // ウェブプッシュ証明書のキーを貼り付ける
        serviceWorkerRegistration: sw //サービスワーカを指定（省略するとルートディレクトリのfirebase-messaging-sw.jsを登録しようとする）
      }).then(function(token) {
        //トークン発行
        if (token) {
          //トークンがDBに入っているか確認
          getDocs(query(usersRef, where('token', '==', token))).then(function(oldLog){
          //usersRef.where('token', '==', token).get().then(function(oldLog){
            if(oldLog.empty){
              //トークン登録がなければ購読ボタン表示
              console.log('トークンは登録されていません。');
              ShowEntryButton();
            } else {
              //トークン登録があれば購読解除を行う
              oldLog.forEach(function(d){
                //console.log(d.data());
                updateDoc(doc(usersRef, d.id),{
                  subscribe: false
                }).then(function() {
                    console.log("購読を解除しました。");
                    ShowEntryButton();
                  }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
              });
            }
          });
          //購読状況表示更新
          $('#notification p.caution').text('購読を解除しました。');
        } else {
          console.log('トークンを取得できませんでした。');
          $('#notification p.caution').text('購読を開始できませんでした。');
        }
      }).catch(function(err) {
        console.log('トークンを取得できませんでした。', err);
        $('#notification p.caution').text('購読を開始できませんでした。');
      });
    }).catch(function (err) {
      console.log('通知の承認が得られませんでした。', err);
      $('#notification p.caution').text('プッシュ通知が許可されていません。ブラウザの設定を確認してください。');
      ShowEntryButton();
    });
  }

  //　トークン表示
  function displayToken() {
    getToken().then(token => {
      if (token) {
        console.log(token);
      } else {
        console.log('トークンを取得できませんでした。');
      }
    }).catch(function (err) {
      console.log('トークンの取得時にエラーが発生しました。', err);
    });
  }


  //購読ボタン表示
  function ShowEntryButton() {
    $('#EntryButton').show();
    $('#RemoveButton').hide();
  }

  //購読取消ボタン表示
  function ShowRemoveButton() {
    $('#EntryButton').hide();
    $('#RemoveButton').show();
  }
