//phina.jsで作る避けゲーム
phina.globalize();

//グローバル変数
var ASSETS = {
  image: {
    'tapioka0': './tapioka0.png',
    'tapioka1': './tapioka1.png',
    'tapioka2': './tapioka2.png',
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

    this.score=0;
    console.log(this.score);

    this.scoretxt = Label({
      text: '',
      fontSize: 48,
      x: this.gridX.center(),
      y: this.gridY.center(),
    }).addChildTo(this);

    this.mouse = Mouse().addChildTo(this);
    this.tapigroup = DisplayElement().addChildTo(this);
    Tapioka().addChildTo(this.tapigroup);
  },

  update: function (app) {

    //タピオカとマウスの当たり判定
    //console.log(this.mouse.x);


    //foreachの中から、親のクラスが参照できないので、いったんマウス座標を格納
    moux=this.mouse.x;
    mouy=this.mouse.y;
    moupm=Math.floor(MOUSE_CIRCLE_RADIUS/2)+5; //マウスの当たり判定+-いくつまでにするか
    tempscore=0;
    console.log(this.score , tempscore);
    this.tapigroup.children.each(function(elm){
      if( (moux-moupm<=elm.x && elm.x<=moux+moupm) && (mouy-moupm<=elm.y && elm.y<=mouy+moupm) ){
        elm.remove();
        tempscore+=1;
      }
    });
    console.log(this.score , tempscore);
    this.score+=tempscore;

    //タピオカ同士の当たり判定
    
    //スコア表示
    this.scoretxt.text = "Score : " + this.score;
    
    //一定間隔でタピオカ追加
    if (app.frame % 3 == 0) {
      Tapioka().addChildTo(this.tapigroup);
      //console.log(this.tapigroup);
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
    //randpicで画像をランダムに決める
    var picstr="";
    var randpic=Math.round(Math.random() * 3);
    if(randpic==0){
      picstr="tapioka0";
    }else if(randpic==1){
      picstr="tapioka1";
    }else{
      picstr="tapioka2";
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
    this.width = 64;
    this.height = 64;
  },

  update: function (app) {
    this.rotation+=10;
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