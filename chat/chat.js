var app = require('express')();//expressを使うため
var http = require('http').Server(app);//expressを使って通信を扱う
var io = require('socket.io')(http);//socketを使うため
var POST = 3000;//localhost:3000

//ルートディレクトリにアクセスした時に動く処理
app.get('/', function(req, res) {
  //index.htmlにリダイレクトする
  res.sendFile(__dirname + '/index.html');
});

//socket.ioに接続された時に動く処理
io.on('connection', function(socket) {
  //接続時に振られた一意のIDをコンソールに表示
  console.log('入室したID : %s', socket.id);

  //接続時に全員にIDを表示（messageというイベントでクライアント側とやりとりする）
  io.emit('message', socket.id + 'さんが入室しました！', 'System');

  //messageイベントで動く
  //全員に取得したメッセージとIDを表示
  socket.on('message', function(msj) {
    io.emit('message', msj, socket.id);
  });

  //接続が切れた時に動く
  //接続が切れたIDを全員に表示
  socket.on('disconnect', function(e) {
    console.log('接続が切れたID : %s', socket.id);
  });
});

//接続待ち状態になる
http.listen(POST, function() {
  console.log('接続開始', POST);
});