var Room = require('../models/room.server.model');

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
    users: [req.body.users[0].userId],
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
  res.send("Connected correctly to server :: Delete room");
  Room.remove({
    _id: req.params.roomId
  }, function(err, result) {
    res.send(result.WriteResult);
  });
};

// AS-IS POST /rooms/:roomId/user/:userId
// TO-BE POST /rooms/:roomId/user/     body : {"userId": "abcd1234"}
// 방 참가 (멤버추가)
exports.join = function(req, res) {
  res.send("Connected correctly to server :: Join room");
  if (!req.body) {
    return res.sendStatus(400);
  }
  console.log("Room Id : " + req.params.roomId);
  console.log("User Id : " + req.body.userId);

  Room.update({
    _id: req.params.roomId
  }, {
    $addToSet: {
      users: req.body.userId
    }
  }, {
    upsert: true
  }, function(err, result) {
    res.send(result.WriteResult);
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
      users: req.params.userId
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
