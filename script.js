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
    this.scoretxt = Label({
      text: '',
      fontSize: 48,
      x: this.gridX.center(),
      y: this.gridY.center()-50,
    }).addChildTo(this);

    this.time=0;
    this.timetxt = Label({
      text: '',
      fontSize: 48,
      x: this.gridX.center(),
      y: this.gridY.center(),
    }).addChildTo(this);

    this.objcnt=1;
    this.objcnttxt = Label({
      text: '',
      fontSize: 48,
      x: this.gridX.center(),
      y: this.gridY.center()+50,
    }).addChildTo(this);

    this.nekoTapiRevel=1;

    this.mouse = Mouse().addChildTo(this);
    this.tapigroup = DisplayElement().addChildTo(this);
    Tapioka().addChildTo(this.tapigroup);
  },



  update: function (app) {
    //タピオカとマウスの当たり判定
    //foreachの中から、親のクラスが参照できないので、いったんマウス座標を格納
    moux=this.mouse.x;
    mouy=this.mouse.y;
    moupm=Math.floor(MOUSE_CIRCLE_RADIUS/2)+5; //マウスの当たり判定+-いくつまでにするか
    tempscore=0;
    tempobjcnt=this.objcnt;
    this.tapigroup.children.each(function(elm){
      if( (moux-moupm<=elm.x && elm.x<=moux+moupm) && (mouy-moupm<=elm.y && elm.y<=mouy+moupm) ){
        elm.remove();
        tempscore+=1;
      }
    });

    //最後の3秒は、ボーナスタイム
    if(this.time<=27000){
      this.score+=tempscore*tempobjcnt;
    }else{
      tempscore+=1;//掛け算で0をかけちゃうのを防ぐ
      this.score+=this.score*tempscore*tempobjcnt;
    }
    
    //スコアと時間とオブジェクトの数表示
    this.scoretxt.text = "Score : " + this.score;
    this.time+=app.deltaTime;
    this.timetxt.text = "Time  : " + Math.floor(this.time/1000);
    this.objcnt=this.tapigroup.children.length;
    this.objcnttxt.text = "猫とタピオカ  : " + this.objcnt;
    
    //レベルの定義
    this.nekoTapiRevel = this.objcnt%100;
    console.log(this.nekoTapiRevel);
    
    //一定間隔でタピオカ追加
    //画面内部の猫とタピオカの数に応じて、追加の割合が上がる(同時に複数個投入される)
    if (app.frame % 3 == 0) {
      for(var i=0; i<this.nekoTapiRevel; i++){
        Tapioka().addChildTo(this.tapigroup);
      }
    }

    //終了条件
    if(this.time>=30000){
      this.time=0;
      this.exit();
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
    //rotateで回転方向を決める
    this.rotate = Math.round(Math.random() * 2);
  },

  update: function (app) {
    if(this.rotate==0){
      this.rotation+=10;
    }else{
      this.rotation-=10;
    }
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