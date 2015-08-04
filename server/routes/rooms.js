var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var url = 'mongodb://70.30.14.125:27017/rollingpaint';
//var url = 'mongodb://localhost:27017/rollingpaint';

// 방 생성
router.post('/:title', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server with ham");

    db.collection('rooms').insert([{
        title: req.params.title,
        owner: 'ham',
        capacity: 8,
        status: 'ready'
      }], function(err, result) {
        console.log('error occured');
    });
    db.close();
  });
  res.send('Make room : ' + req.params.title);
});

// 방 조회
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

  //db.collection('rooms')
});

// 방 수정
router.put('/', function(req, res, next) {
  res.send('respond with a resource');

  //db.collection('rooms')
});

// 방 삭제
router.delete('/', function(req, res, next) {
  res.send('respond with a resource');

  //db.collection('rooms')
});



module.exports = router;
