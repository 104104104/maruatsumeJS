//phina.jsで作る避けゲーム
phina.globalize();

//グローバル変数
var ASSETS = {
  image: {
    'tapioka': './tapioka.png',
  },
};
var TAPIOKA_MAX_NUM = 100;
var MOUSE_CIRCLE_RADIUS = 16;
//画面サイズ
var WIDTH = 918;
var HEIGHT = 1378;

//シーンマネージャー
phina.define('MyManagerScene', {
  superClass: 'ManagerScene',
  init: function () {
    this.superInit({
      scenes: [
        // タイトル
        {
          label: 'マイタイトル',
          className: 'MyTitleScene',
          nextLabel: 'メインシーン'
        },
        {
          label: 'メインシーン',
          className: 'MainScene',
          nextLabel: 'マイタイトル'
        }
      ]
    });
  }
});

//タイトルシーン
phina.define('MyTitleScene', {
  superClass: 'DisplayScene',

  init: function (options) {
    options = ({
      width: WIDTH,
      height: HEIGHT,
    });
    this.superInit(options);

    var label = Label('MyTitleScene').addChildTo(this);
    label.x = this.gridX.center();
    label.y = this.gridY.center();
  },
  onclick: function () {
    //次のシーンへ移動
    this.exit();
  }
});

//メインシーン
phina.define("MainScene", {
  superClass: 'DisplayScene',

  init: function (options) {
    options = ({
      width: WIDTH,
      height: HEIGHT,
    });
    this.superInit(options);

    var mouse = Mouse().addChildTo(this);
    this.tapigroup = DisplayElement().addChildTo(this);
    Tapioka().addChildTo(this.tapigroup);
  },

  update: function (app) {
    if (app.frame % 15 == 0) {
      Tapioka().addChildTo(this.tapigroup);
      console.log(this.tapigroup);
    }
  },

});

//マウスの定義
phina.define("Mouse", {
  superClass: 'CircleShape',

  init: function (options) {
    options = ({
      fill: "red",
      stroke: null,
      radius: MOUSE_CIRCLE_RADIUS,
    });
    this.superInit(options);
    this.blendMode = 'lighter';
  },

  update: function (app) {
    var p = app.pointer;
    this.x = p.x;
    this.y = p.y;
  },
});

//タピオカの定義
phina.define("Tapioka", {
  superClass: "Sprite",

  init: function () {
    this.superInit('tapioka');
    //初期位置は、4つの画面のはじのどこか rand4で場所を決める
    var rand4 = Math.round(Math.random() * 4);
    console.log(rand4);
    if (rand4 == 0) {
      this.x = Math.round(Math.random() * WIDTH);
      this.y = 0;
      //console.log(00);
    } else if (rand4 == 1) {
      this.x = 0;
      this.y = Math.round(Math.random() * HEIGHT);
      //console.log(11);
    } else if (rand4 == 2) {
      this.x = Math.round(Math.random() * WIDTH);
      this.y = HEIGHT;
      //console.log(22);
    } else {
      this.x = WIDTH;
      this.y = Math.round(Math.random() * HEIGHT);
      //console.log(33);
    }
    this.width = 64;
    this.height = 64;
  },

  update: function (app) {
    var p = app.pointer;
    if (this.x >= p.x) {
      this.x -= Math.floor(Math.random() * (1 + 1 - 1)) + 10;
    } else {
      this.x += Math.floor(Math.random() * (1 + 1 - 1)) + 10;
    }
    if (this.y >= p.y) {
      this.y -= Math.floor(Math.random() * (1 + 1 - 1)) + 10;
    } else {
      this.y += Math.floor(Math.random() * (1 + 1 - 1)) + 10;
    }
  },
});

//メイン処理
phina.main(function () {
  var app = GameApp({
    assets: ASSETS,
    width: WIDTH,
    height: HEIGHT,
    fps: 30,
  });
  //ManegerSceneを使う設定
  app.replaceScene(MyManagerScene());
  app.run();
});