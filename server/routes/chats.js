var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


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


// 마지막에 모듈셋팅
module.exports = router;
