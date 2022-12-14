// 読み込み後の処理

window.onload = function(){
  //バナーの代わりに表示するボタンを登録する
  registerInstallAppEvent(document.getElementById("InstallBtn"));

  //通知許可を取得するボタンイベント
  document.getElementById('confirmBtn').addEventListener('click', () => {
    Notification.requestPermission().then(permission => {
      alert(permission); // granted or denied
    });
  });

  // 通知送信ボタンイベント
  document.getElementById('sendBtn').addEventListener('click', () => {
    console.log('clickされた？');
    console.log(Notification.permission);
    if (Notification.permission === 'granted') {
      console.log('grantedの処理');
      navigator.serviceWorker.ready.then(function (sw){
        return sw.showNotification("手動プッシュ通知テスト",{
          body: "通知テスト２"
        })
      })
    }
  });



}



//バナー表示をキャンセルし、代わりに表示するDOM要素を登録する関数
//引数１：イベントを登録するHTMLElement
function registerInstallAppEvent(elem){
  //インストールバナー表示条件満足時のイベントを乗っ取る
  window.addEventListener('beforeinstallprompt', function(event){
    console.log("beforeinstallprompt: ", event);
    event.preventDefault(); //バナー表示をキャンセル
    elem.promptEvent = event; //eventを保持しておく
    elem.style.display = "block"; //要素を表示する
    return false;
  });
  //インストールダイアログの表示処理
  function installApp() {
    if(elem.promptEvent){
      elem.promptEvent.prompt(); //ダイアログ表示
      elem.promptEvent.userChoice.then(function(choice){
        elem.style.display = "none";
        elem.promptEvent = null; //一度しか使えないため後始末
      });//end then
    }
  }//end installApp
  //ダイアログ表示を行うイベントを追加
  elem.addEventListener("click", installApp);
}//end registerInstallAppEvent
