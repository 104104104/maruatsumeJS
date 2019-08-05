//phina.jsで作る避けゲー

// グローバルに展開
phina.globalize();

//シーンマネージャー
phina.define('MyManagerScene', {
  superClass: 'ManagerScene',
  init: function () {
    this.superInit({
      scenes: [
        // タイトル
        {
          label: 'Title',
          className: 'TitleScene',
          nextLabel: 'Main'
        },
        {
          label: 'Main',
          className: 'MainScene',
          nextLabel: 'Title'
        }
      ]
    });
  }
});

//シーン１
phina.define("TitleScene", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();

    // スプライト作成
    var circle = CircleShape().addChildTo(this);
    // 初期位置
    circle.x = 0;
    circle.y = 0;
    // タッチを有効にする
    circle.setInteractive(true);
    // タッチイベント登録
    scene=this; //circleの関数の中からのthisは、circleのことになる。そこで、いったん代入
    circle.onclick = function() {
      // 画面遷移
      scene.exit();
    };
  },
});

//シーン２
phina.define("MainScene", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();

    // スプライト作成
    var circle = CircleShape().addChildTo(this);
    // 初期位置
    circle.x = this.gridX.center();
    circle.y = this.gridY.center();
    // タッチを有効にする
    circle.setInteractive(true);
    // タッチイベント登録
    scene=this; //circleの関数の中からのthisは、circleのことになる。そこで、いったん代入
    circle.onclick = function() {
      // 画面遷移
      console.log(this);
      scene.exit();
    };
  },
});


/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({

    // 画面遷移
    // Titleから開始
    startLabel: 'Title',
    // シーンのリストを引数で渡す
    scenes: [
      // タイトル
      {
        label: 'Title',
        className: 'TitleScene',
        nextLabel: 'Main'
      },
      {
        label: 'Main',
        className: 'MainScene',
        nextLabel: 'Title'
      }
    ]
  });

  // 実行
  app.run();
});