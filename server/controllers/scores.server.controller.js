var Score = require('../models/score.server.model');
var _ = require('underscore') ;


// post  /score
// 게임시작시, user들의 score(단어점수,인기점수)를 모두 0으로 셋팅
// 조건 : roomid 일치
exports.createScore = function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  var score = new Score({ _id: req.body.roomid, users:req.body.users});
  score.save(function (err) {
    if (err) {
      return res.sendStatus(500);
    }

    Score.findById(score, function (err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    });
  });
};

// post  /score/gamescore/1/user/A
// 1번방의 A유저가 단어를 맞추었을 때 1점 추가
// 조건 : roomid, userid 일치
exports.updateGameScore = function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  Score.update({_id :req.params.roomid,'users.userid' : req.params.id}, {$inc :{'users.$.gamescore' : 1}}, function(err, result) {
    res.send(result);
  });
};

// post  /score/popularityscore/1/user/A
// 1번방의 A유저의 그림이 '좋아요'를 획득하였을때 1점 추가
// 조건 : roomid, userid 일치
exports.updatePopularityScore = function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  Score.update({_id :req.params.roomid,'users.userid' : req.params.id}, {$inc :{'users.$.popularityscore' : 1}}, function(err, result) {
    res.send(result);
  });
};

// get/score
// 랭킹화면 구성을 위해 총 점수 불러오기
// 조건 : roomid 일치
// Find all pictures
exports.getScore = function(req, res, next) {
  Score.findById(req.params.id, function(err, result) {
    var newresult = _.sortBy(result.users,'gamescore').reverse();
    res.send(newresult);
  });
};
