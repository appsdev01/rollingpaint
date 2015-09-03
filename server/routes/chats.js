var router = require('express').Router();

var http = require('http').Server();
var io = require('socket.io')(http);

//app.use('/chats', chats);

router.get('/', function(req, res){
  res.sendFile(__dirname + '/chat.html');
  //res.sendFile('../../app/chat/chat.html'); // html file send example

  //res.sendfile('index.html');
});

// broadcasting
io.on('connection', function(socket) {
//  socket.emit('chat message', msg);
//  socket.on('chat message', function(msg) {
//    console.log("server : " + msg);
//  });
  socket.emit('toClient', {msg : 'welcome'});
  socket.on('fromClient', function(data) {
    socket.boradcast.emit('toClient', data); // 자신을 제외하고 다른 client에게 전송
    socket.emit('toClient', data); // 해당 클리아언트에게만 보냄.
    console.log('Message from Client : ' + data.msg);
  });
});

/*

  // broadcasting
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('chat message : ' + msg);
    });
});

*/



/*
var url = 'mongodb://localhost:27017/rollingpaint';
//var url = 'mongodb://localhost:port/rollingpaint';

// mongodb CRUD 테스트해보기
// post -> insert
// get => select
// get * -> select *
// delete -> delete
// put -> update
router.post('/:roomNumber', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
      console.log("Connected correctly to server");

      db.collection('chats');

      db.close();

    })
});

//router.delete('');

// '/chats/'
// 새로 추가되는 정보들은 body에 들어오는 것으로 ..
router.post('/', function(req, res, next) {
  console.log('new !!');
  console.log(req.body);

  res.send(req.body);

  MongoClient.connect(url, function(err, db) {
    db.collection('chats').insert([
      {roomName: req.body.roomName}
    ], function(err, result) {
      console.log(req.body);
      res.json(req.body);
      res.json(result);
      db.close();
    });

  })

//  res.json(req.body);
});

*/
// 마지막에 모듈셋팅
module.exports = router;
