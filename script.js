/*
 * runstant
 */

phina.globalize();

//============================================
// タイトルシーン
//============================================
phina.define('MyTitleScene', {
  superClass: 'DisplayScene',
  
  init: function() {
    this.superInit();
    
    var label = Label('MyTitleScene').addChildTo(this);
    label.x = this.gridX.center();
    label.y = this.gridY.center();
  },
  onclick:function(){
    //次のシーンへ移動
    this.exit();
  }
});
//============================================
// マネージャーシーン
//============================================
phina.define('MyManagerScene' , {
  superClass: 'ManagerScene' ,
  init: function() {
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

var MOUSE_CIRCLE_RADIUS = 16;
var TAPIOKA_MAX_NUM = 100;

var ASSETS = {
  image: {
    'tapioka': './tapioka.png',
  },
};

// マウスの定義
phina.define("Mouse", {
  superClass: 'CircleShape',

  init: function(options) {
    options = (options || {}).$safe({
      fill: "red",
      stroke: null,
      radius: MOUSE_CIRCLE_RADIUS,
    });
    this.superInit(options);

    this.blendMode = 'lighter';
  },

  update: function(app) {
    var p = app.pointer;
    this.x = p.x;
    this.y = p.y;
  },
});
// マウスの定義　終わり

// タピオカの定義
phina.define("Tapioka", {
  superClass: "Sprite",

  init: function(options) {
    this.superInit('tapioka');
    this.x=0;
    this.y=0;
    this.width=64;
    this.height=64;
  },

  update: function(app) {
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
//タピオカの定義終わり

phina.define('MainScene', {
  superClass: 'DisplayScene',

  init: function() {
    this.superInit();

    this.backgroundColor = '#999';

    var mouse = Mouse().addChildTo(this);
    mouse.x = 0;
    mouse.y = 0;


    var label = Label({
      text: '',
      fontSize: 48,
      x: this.gridX.center(),
      y: this.gridY.center(),
    }).addChildTo(this);

    // グループを生成
    this.tapiokas = DisplayElement().addChildTo(this);

    var tapioka = Tapioka().addChildTo(this.tapiokas);


    // 更新処理
    this.update = function(app) {
      // 経過秒数表示
      label.text = '経過秒数：' + app.frame +" " +app.frame % 50;
      if (app.frame % 50 == 0) {
        var tapioka = Tapioka().addChildTo(this.tapiokas);

      }
    };

  },
});


phina.main(function() {
  var app = GameApp({
    assets: ASSETS,
  });
  //=========================================
  //作成したManagerSceneを使うにはこれが必要
  app.replaceScene(MyManagerScene());
  //=========================================
  app.run();
});
