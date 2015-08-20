var router = require('express').Router();
var Score = require('../models/score');

// post/score/zero
// 게임시작시, user의 score(단어점수,인기점수)를 모두 0으로 셋팅
// 조건 : roomid 일치
router.post('/', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  var score = new Score({ roomid: req.body.roomid, users:{userid : req.body.userid, gamescore : 0, popularityscore : 0} });
  score.save(function (err) {
    if (err) {
      return res.sendStatus(500);
    }

    Score.findById(score, function (err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    });
  });
});

// post/score/game
// 단어 맞추었을때, 단어 점수 1점 추가
// 조건 : roomid, userid 일치

// post/score/like
// 게임 후 채팅시, 좋아요를 받았을때, 인기 점수 1점 추가
// 조건 : roomid, userid 일치

// get/score
// 랭킹화면 구성을 위해 총 점수 불러오기
// 조건 : roomid 일치


module.exports = router;
