var router = require('express').Router();
var Score = require('../models/score');

// post/score/zero
// 게임시작시, user의 score(단어점수,인기점수)를 모두 0으로 셋팅
// 조건 : roomid 일치

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
