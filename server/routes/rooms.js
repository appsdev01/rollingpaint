var router = require('express').Router();
var Room = require('../models/room.js');

// REST API Naming Rule
// 1번방에 A 유저 추가하기 (body에 json으로)
/*
POST /room/1/user
{
  "userId": "A"
}

// 1번방에 있는 유저 조회하기
GET /room/1/user

// 1번방에 있는 A 유저 조회하기 (param으로)
GET /room/1/user/A

// 1번방에서 A 유저가 나갈 때
DELETE /room/1/user/A

// 1번방에서 방장 위임하기
POST /room/1/owner
{
  "userId": "A"
}
*/






// Create a room
router.post('/:id', function(req, res, next) {
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
