var router = require('express').Router();
var Rooms = require('../models/room.js');

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

// 1번 방 정보 조회
// GET /room/1
router.get('/', function(req, res, next) {
  Room.find(function(err, results) {
      res.send(results);
  });
});

// 방 생성하기 (방장세팅)
// POST /room/user
router.post('/create', function(req, res, next) {
  console.log("Connected correctly to server :: Create room");
  if (!req.body) {
    return res.sendStatus(400);
  }

  console.log(req.body);

  var room = new Rooms({
    title: req.body.title,
    password: req.body.password,
    capacity: req.body.capacity,
    ownerId: req.body.ownerId,
    status: "01",
    wordseed: req.body.wordseed,
    gameround: 1,
    users: [req.body.users[0].userId],
    sketchbooks: []
  });
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
