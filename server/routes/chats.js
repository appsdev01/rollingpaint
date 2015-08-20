var router = require('express').Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
   res.sendFile(__dirname + '/chat.html'); // html file send example
  //res.sendfile('index.html');
});

  // broadcasting
io.on('connection', function(socket){
  socket.emit('toclient', {msg: 'Welcome !!'});
  socket.on('fromclient', function(data){
    socket.broadcast.emit('toclient', data); // 나를 제외한 타 client에게 전송
    //socket.emit('toclient', data); // 해당 client에게만 전송, 타 clinet에게 보내려면?
    console.log('Message from clinet : ' + data.msg);
    });
});

/*
// broadcasting
io.on('connection', function(socket){
socket.on('chat message', function(msg){
io.emit('chat message', msg);
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
