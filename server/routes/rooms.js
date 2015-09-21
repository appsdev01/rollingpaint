var router = require('express').Router();
var Room = require('../models/room');

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


// 전체 방 조회
// GET /rooms
router.get('/', function(req, res, next) {
  Room.find(function(err, results) {
      res.send(results);
  });
});

// 방 생성하기 (방장세팅)
// POST /room/user
router.post('/', function(req, res, next) {
  console.log("Connected correctly to server :: /create");
  if (!req.body) {
    return res.sendStatus(400);
  }
  // console.log(req.body);
  var room = new Room({
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
      console.log(doc); // 생성한 방 정보
      res.send(doc);
    });
  });
});

// 방 수정
// router.put('/:id', function(req, res, next) {
//   res.send("Connected correctly to server :: Modify room");
//   if (!req.body) {
//     return res.sendStatus(400);
//   }
//   Room.update({_id:req.params.id}, function(err, result) {
//     res.send(result);
//   });
// });

// 방 삭제
router.delete('/:id', function(req, res, next) {
  res.send("Connected correctly to server :: Delete room");
  Room.remove({_id:req.params.id}, function(err, result) {
    console.log(result);
    res.send(result);
  });
});



module.exports = router;
