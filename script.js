//phina.jsで作る避けゲーム
phina.globalize();

//グローバル変数
var ASSETS = {
  image: {
    'tapioka0': './tapioka0.png',
    'tapioka1': './tapioka1.png',
    'tapioka2': './tapioka2.png',
    'title': './title.jpg',
    'finish': './finishbutton.jpg',
    'nekotapi': './nekototapiocatxt.jpg',
  },
};
var TAPIOKA_MAX_NUM = 100;
var MOUSE_CIRCLE_RADIUS = 16;
//画面サイズ
var WIDTH = 918;
var HEIGHT = 1378;
var globalTime = 0;
var TIME = 30000;

//タイトルシーン
phina.define('MyTitleScene', {
  superClass: 'DisplayScene',

  init: function (options) {
    options = ({
      width: WIDTH,
      height: HEIGHT,
    });
    this.superInit(options);

    this.titlePic = Sprite('title').addChildTo(this);
    this.titlePic.x = this.gridX.center();
    this.titlePic.y = this.gridY.center();
  },
  update: function () {
    this.titlePic.x = this.gridX.center();
    this.titlePic.y = this.gridY.center();
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

    //時間を表す背景の四角
    this.timerect = RectangleShape({
      radius: Math.floor(WIDTH / 2),
      width: WIDTH,
      height: HEIGHT,
      fill: 'skyblue',
      stroke: null,
      blendMode: 'lighter',
    }).addChildTo(this);
    this.timerect.setPosition(this.gridX.center(), this.gridY.center());

    this.mouse = Mouse().addChildTo(this);
    this.tapigroup = DisplayElement().addChildTo(this);
    Tapioka().addChildTo(this.tapigroup);

    //ヘッダの背景
    var header = RectangleShape({
      width: WIDTH,
      height: Math.floor(170),
      fill: 'gray',
    }).addChildTo(this);
    header.setPosition(this.gridX.span(8), this.gridY.span(1));
    this.headerTime = RectangleShape({
      width: 0,
      height: Math.floor(170),
      fill: 'black',
    }).addChildTo(this);
    this.headerTime.setPosition(this.gridX.span(0), this.gridY.span(1));

    //説明の文字
    /*
    this.txt2 = Label({
      text: 'Time',
      fontSize: 48,
      fill: 'white',
      x: this.gridX.center(),
      y: this.gridY.span(0) + 40,
    }).addChildTo(this);
    */
    /*
    this.txt3 = Label({
      text: '猫とタピオカ',
      fontSize: 48,
      fill: 'white',
      x: this.gridX.span(12),
      y: this.gridY.span(0) + 40,
    }).addChildTo(this);
    */

    //スコアなど表示
    this.score = 0;
    this.time = 0;
    this.objcnt = 1;

    this.timetxt = Label({
      text: '',
      fontSize: 96,
      fill: 'white',
      x: this.gridX.center(),
      y: this.gridY.span(1),
    }).addChildTo(this);

    /*
    this.objcnttxt = Label({
      text: '',
      fontSize: 48,
      fill: 'white',
      x: this.gridX.span(12),
      y: this.gridY.span(1) + 30,
    }).addChildTo(this);
    */

    this.nekoTapiRevel = 1;
    this.nekoTapiRevelLast = 1;
    this.nekoTapiRevelFlug1 = 0;
    this.nekoTapiRevelFlug2 = 0;

    this.resultgroup = DisplayElement().addChildTo(this);
  },



  update: function (app) {
    //タピオカとマウスの当たり判定
    //foreachの中から、親のクラスが参照できないので、いったんマウス座標を格納
    moux = this.mouse.x;
    mouy = this.mouse.y;
    moupm = Math.floor(MOUSE_CIRCLE_RADIUS / 2) + 5; //マウスの当たり判定+-いくつまでにするか
    tempscore = 0;
    tempobjcnt = this.objcnt;
    this.tapigroup.children.each(function (elm) {
      if ((moux - moupm <= elm.x && elm.x <= moux + moupm) && (mouy - moupm <= elm.y && elm.y <= mouy + moupm)) {
        elm.remove();
        tempscore += 1;
      }
    });

    this.score += tempscore;

    //レベルの値
    //console.log(this.objcnt, this.nekoTapiRevelFlug1, this.nekoTapiRevel);
    if (this.objcnt >= 10 && this.nekoTapiRevelFlug1 == 0) {
      this.nekoTapiRevel += 1;
      this.nekoTapiRevelFlug1 = 1;
    }
    if (this.objcnt >= 20 && this.nekoTapiRevelFlug2 == 0) {
      this.nekoTapiRevel += 1;
      this.nekoTapiRevelFlug2 = 1;
    }
    if (this.nekoTapiRevelFlug1 == 1 && this.nekoTapiRevelFlug2 == 1) {
      if (this.objcnt <= 190) {
        this.nekoTapiRevel = Math.floor(this.objcnt / 100) + 1;
      } else {
        this.nekoTapiRevel = Math.floor(this.objcnt / 30) + 1;
      }
    }
    //console.log(this.nekoTapiRevel);

    //一定間隔でタピオカ追加
    //画面内部の猫とタピオカの数に応じて、追加の割合が上がる(同時に複数個投入される)
    //時間を過ぎたら、追加しない
    //最大値は1300(理論上の最大値は1238のはず)
    var maxTapiCount = 1300;
    if (app.frame % 15 == 0 && this.time <= TIME && this.objcnt <= 30) {
      for (var i = 0; i < this.nekoTapiRevel; i++) {
        if (this.tapigroup.children.length <= maxTapiCount) {
          Tapioka().addChildTo(this.tapigroup);
        }
      }
    }
    if (app.frame % 3 == 0 && this.time <= TIME && this.objcnt >= 31) {
      for (var i = 0; i < this.nekoTapiRevel; i++) {
        if (this.tapigroup.children.length <= maxTapiCount) {
          Tapioka().addChildTo(this.tapigroup);
        }
      }
    }

    //スコアと時間とオブジェクトの数表示
    this.time += app.deltaTime;
    globalTime = this.time
    this.objcnt = this.tapigroup.children.length;
    if (this.time <= TIME) {
      this.timetxt.text = 30 - Math.floor(this.time / 1000);
    } else {
      this.timetxt.text = 0;
    }
    //this.objcnttxt.text = this.objcnt + "個";

    //時間の四角表示。だんだん短くなる
    if (this.time <= TIME) {
      this.timerect.height = HEIGHT - ((this.time / TIME) * HEIGHT) + 1;
      this.timerect.width = WIDTH - ((this.time / TIME) * WIDTH) + 1;
      this.timerect.radius = WIDTH / 2 - ((this.time / TIME) * WIDTH / 2) + 1;
    }
    //ヘッダの時間表示
    if (this.time <= TIME) {
      this.headerTime.width = ((this.time / TIME) * WIDTH * 2) + 1;
    }


    //終了条件
    if (this.time >= TIME) {
      this.finishrec = Sprite('finish').addChildTo(this.resultgroup);
      this.finishrec.x = this.gridX.center();
      this.finishrec.y = this.gridY.span(5);
    }

    //タピオカの数を、リザルトに表示
    if (this.time >= TIME + 1000) {
      this.finishrec2 = Sprite('nekotapi').addChildTo(this.resultgroup);
      this.finishrec2.x = this.gridX.center();
      this.finishrec2.y = this.gridY.span(8);

      //スコア表示
      var resultScoreTxt = Label(this.objcnt + '個').addChildTo(this.resultgroup);
      // 初期位置
      resultScoreTxt.x = this.gridX.center();
      resultScoreTxt.y = this.gridY.span(9)-40;
      resultScoreTxt.fontSize = 96;
      resultScoreTxt.fill = 'white';
    }

    if (this.time >= TIME + 2000) {
      this.finishrec3 = RectangleShape({
        x: this.gridX.center(),
        y: this.gridY.span(13),
        width: WIDTH / 2,
        height: 200,
        fill: 'white',
        stroke: null,
      }).addChildTo(this.resultgroup);
      // タッチを有効にする
      this.finishrec3.setInteractive(true);
      // タッチイベント登録
      scene = this; //buttomの関数の中からのthisは、buttomのことになる。そこで、いったん代入
      this.finishrec3.onclick = function () {
        // 画面遷移
        this.time=0;//念の為戻す
        scene.exit();
      }

      //タイトルに戻るボタンの文字
      var buttom = Label('Back To Title').addChildTo(this.resultgroup);
      // 初期位置
      buttom.x = this.gridX.center();
      buttom.y = this.gridY.span(13);
      buttom.fontSize = 48;
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
    //this.blendMode = 'lighter';
  },

  update: function (app) {
    //制限時間をすぎたら、動かなくなる
    if (globalTime <= TIME) {
      var p = app.pointer;
      this.x = p.x;
      this.y = p.y;
    }
  },
});

//タピオカの定義
phina.define("Tapioka", {
  superClass: "Sprite",

  init: function () {
    //randpicで画像をランダムに決める
    var picstr = "";
    var randpic = Math.round(Math.random() * 3);
    if (randpic == 0) {
      picstr = "tapioka0";
    } else if (randpic == 1) {
      picstr = "tapioka1";
    } else {
      picstr = "tapioka2";
    }
    this.superInit(picstr);
    //初期位置は、4つの画面のはじのどこか rand4で場所を決める
    var rand4 = Math.round(Math.random() * 4);
    if (rand4 == 0) {
      this.x = Math.round(Math.random() * WIDTH);
      this.y = 0;
    } else if (rand4 == 1) {
      this.x = 0;
      this.y = Math.round(Math.random() * HEIGHT);
    } else if (rand4 == 2) {
      this.x = Math.round(Math.random() * WIDTH);
      this.y = HEIGHT;
    } else {
      this.x = WIDTH;
      this.y = Math.round(Math.random() * HEIGHT);
    }

    //sizeで、大きさと動く早さが決まる
    //randsizeで大きさを決める
    var randsize = Math.round(Math.random() * 100);
    //console.log(randsize);
    if (randsize <= 30) {
      this.size = 0;
      //大きさは、画面サイズとの比率で決まる
      this.width = Math.floor(WIDTH / 30);
      this.height = Math.floor(WIDTH / 30);
      this.speed = Math.floor(WIDTH / 300);
      //回転の早さも大きさ依存
      this.rotatelen = 20;
    } else if (31 <= randsize && randsize <= 95) {
      this.size = 1;
      //大きさは、画面サイズとの比率で決まる
      this.width = Math.floor(WIDTH / 15);
      this.height = Math.floor(WIDTH / 15);
      this.speed = Math.floor(WIDTH / 300);
      //回転の早さも大きさ依存
      this.rotatelen = 8;
    } else {
      this.size = 2;
      //大きさは、画面サイズとの比率で決まる
      this.width = Math.floor(WIDTH / 8);
      this.height = Math.floor(WIDTH / 8);
      this.speed = Math.floor(WIDTH / 300);
      //回転の早さも大きさ依存
      this.rotatelen = 1;
    }
    //console.log(this.width, this.height);

    //rotateで回転方向を決める
    this.rotate = Math.round(Math.random() * 2);
    //移動の為のベクトル
    this.tapivec = new phina.geom.Vector2();
    this.tapivec.x = 0;
    this.tapivec.y = 0;
  },

  update: function (app) {
    if (this.rotate == 0) {
      this.rotation += this.rotatelen;
    } else {
      this.rotation -= this.rotatelen;
    }
    this.tapivec.x = app.pointer.x - this.x;
    this.tapivec.y = app.pointer.y - this.y;
    //console.log(this.tapivec.x, this.tapivec.y);
    //ベクトルの正規化(動きの滑らかさのため、大きさ2で正規化)
    var tapivecScalar = Math.sqrt(this.tapivec.x * this.tapivec.x + this.tapivec.y * this.tapivec.y) / 2;

    //最低でもちょっとは動かないと、後半戦が面白くないので、その為の値
    var minmove = 1;
    var tapivecxNotInt = this.tapivec.x / tapivecScalar;
    if (tapivecxNotInt >= 0) {
      this.tapivec.x = Math.ceil(this.tapivec.x / tapivecScalar) + minmove;
    } else {
      this.tapivec.x = Math.floor(this.tapivec.x / tapivecScalar) - minmove;
    }

    var tapivecyNotInt = this.tapivec.y / tapivecScalar;
    if (tapivecyNotInt >= 0) {
      this.tapivec.y = Math.ceil(this.tapivec.y / tapivecScalar) + minmove;
    } else {
      this.tapivec.y = Math.floor(this.tapivec.y / tapivecScalar) - minmove;
    }
    //移動の為の足し算。時間を過ぎたら、動かなくなる
    if (globalTime <= TIME) {
      this.x += this.tapivec.x * this.speed;
      this.y += this.tapivec.y * this.speed;
    }
    /*
    //八方向にしか追尾しないバージョン
    var p = app.pointer;
    if (this.x >= p.x) {
      this.x -= 10;
    } else {
      this.x += 10;
    }
    if (this.y >= p.y) {
      this.y -= 10;
    } else {
      this.y += 10;
    }*/
  },
});

//メイン処理
phina.main(function () {
  var app = GameApp({
    assets: ASSETS,
    width: WIDTH,
    height: HEIGHT,
    fps: 30,
    query: '#mycanvas',//使うキャンバス指定
    startLavel: 'title',//titleから始めないといけないみたい
    scenes: [
      // タイトル
      {
        label: 'title',
        className: 'MyTitleScene',
        nextLabel: 'Main'
      },
      {
        label: 'Main',
        className: 'MainScene',
        nextLabel: 'title'
      }
    ]
  });
  app.run();
});