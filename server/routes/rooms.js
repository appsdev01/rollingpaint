var router = require('express').Router();
var Room = require('../models/room.js');

//var url = 'mongodb://70.30.14.125:27017/rollingpaint';
var url = 'mongodb://localhost:27017/rollingpaint';

// Create a room
router.post('/', function(req, res, next) {
  console.log("Connected correctly to server :: Create room");
  if (!req.body) {
    return res.sendStatus(400);
  }

  var room = new Room({ title: req.body.title });
  room.save(function (err) {
    if (err) {
      return res.sendStatus(500);
    }

    Room.findById(room, function (err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    });
  });
});

// router.post('/:title', function(req, res, next) {
//   MongoClient.connect(url, function(err, db) {
//     console.log("Connected correctly to server with ham");
//
//     db.collection('rooms').insert([{
//         title: req.params.title,
//         owner: 'ham',
//         capacity: 8,
//         status: 'ready'
//       }], function(err, result) {
//         console.log('error occured');
//     });
//     db.close();
//   });
//   res.send('Make room : ' + req.params.title);
// });

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
