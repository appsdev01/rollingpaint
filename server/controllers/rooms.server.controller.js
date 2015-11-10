var Room = require('../models/room.server.model');
var async = require('async');

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

// 전체 방 조회
exports.list = function(req, res) {
  Room.find(function(err, results) {
    res.send(results);
  });
};

// 방ID로 방 정보 조회
exports.get = function(req, res) {
  Room.findById(req.params.roomId, function(err, doc) {
    if (err) return handleError(err);
    res.send(doc);
  });
};

// 방 생성
exports.create = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  var room = new Room({
    title: req.body.title,
    password: req.body.password,
    capacity: req.body.capacity,
    ownerId: req.body.ownerId,
    status: "01",
    wordseed: req.body.wordseed,
    gameround: 1,
    players: [{
      userId: req.body.users[0].userId,
      username: req.body.users[0].username,
      playStatus: "02"
    }],
    sketchbooks: []
  });
  room.save(function(err) {
    if (err) {
      return res.sendStatus(500);
    }

    Room.findById(room, function(err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    });
  });
};

// 방 삭제
exports.delete = function(req, res) {
  Room.remove({
    _id: req.params.roomId
  }, function(err, result) {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  });
};

// AS-IS POST /rooms/:roomId/user/:userId
// TO-BE POST /rooms/:roomId/user/     body : {"userId": "abcd1234"}
// 방 참가 (멤버추가)
exports.join = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  console.log('# Room Join');
  console.log('- Params');
  console.log(req.params);
  console.log('- Body');
  console.log(req.body);

  async.series([
    function(callback) {
      // 비밀방인 경우 패스워드 확인
      Room.findOne({
        _id: req.params.roomId
      }, function(err, room) {
        if (err) throw err;

        // 비밀방이 아닌 경우(패스워드가 없는 경우) 무시
        if (!room.password) {
          callback(null, room);
          return;
        }

        // 비밀방이지만 전달받은 패스워드가 없는 경우
        if (!req.body.password) {
          callback('MISSING_PASSWORD', room);
          return;
        }

        room.comparePassword(req.body.password, function(err, isMatch) {
          if (err) throw err;

          // isMatch 결과에 따른 처리
          if (isMatch) {
            callback(null, room);
          } else {
            callback('INVALID_PASSWORD', room);
          }
        });
      });
    },
    function(callback) {
      Room.findOne({
        _id:req.params.roomId
      }, function (err, room) {
      // }, {
      //   _id:0, // _id 필드는 생략
      //   players:1 // players 필드만 조회
      // }, function (err, room) {
        if (err) throw err;

        var newPlayer = true;

        console.log("req.body.userId : " + req.body.userId);
        for (var i=0; i<room.players.length; i++) {
          console.log("player Id : " + room.players[i].userId);
          if (room.players[i].userId === req.body.userId) {
            console.log("same");
            newPlayer = !newPlayer;
          }
        }

        if (newPlayer) {
          Room.update({
            _id: req.params.roomId
          }, {
            $addToSet: {
              players: {
                userId: req.body.userId,
                username: req.body.username,
                playStatus: "01"
              }
            }
          }, {
            upsert: true
          }, function(err, result) {
            res.send(result.WriteResult);
          });
        }

      res.send(room.WriteResult);
      });
    }
  ], function(err, result) {
    if (err === 'INVALID_PASSWORD') {
      res.status(403).send({
        error: 'invalid password'
      });
    } else if (err === 'MISSING_PASSWORD') {
      res.status(403).send({
        error: 'missing password'
      });
    }
  });
};

// 방 나가기
exports.leave = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  Room.update({
    _id: req.params.roomId
  }, {
    $pull: {
      players: {
        userId: req.params.userId
      }
    }
  }, function(err, result) {
    res.send(result.WriteResult);
  });
};

// 방장 위임하기
exports.delegate = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  Room.update({
    _id: req.params.roomId
  }, {
    ownerId: req.body.userId
  }, function(err, result) {
    res.send(result.WriteResult);
  });
};

// User Status Update
exports.userUpdate = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  console.log("Room User status change!!!!!!!!!!!!!");
  console.log("Room Id : " + req.params.roomId);
  console.log("User Id : " + req.params.userId);
  console.log("status Code : " + req.body.status);

  Room.update({
    'players.userId': req.params.userId
  }, {
    '$set': {
      'players.$.playStatus': req.body.status
    }
  }, function(err, result) {
    res.send(result.WriteResult);
  });
};

// Room Status Update
exports.update = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  console.log("Room status change!!!!!!!!!!!!!");
  console.log("Room Id : " + req.params.roomId);
  console.log("status Code : " + req.body.status);

  Room.update({
    _id: req.params.roomId
  }, {
    status: req.body.status
  }, function(err, result) {
    res.send(result.WriteResult);
  });
};
