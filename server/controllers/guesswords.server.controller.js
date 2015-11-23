// get/turn
// 게임 진행시, 몇 번째인지 카운팅 하여 화면에 보여주기
// 조건 : roomid, gameid, userid, sketchbook

// get/picture/forgame
// 단어 맞추기 화면에 뿌려줄 그림 조회
// 조건 : roomid, gameid, userid, sketchbook, pictureid

// post/input/word/forgame
// 단어 맞추기 화면에서 입력된 단어를 저장
// 조건 : roomid, gameid, userid, sketchbook, pictureid

var Sketchbook = require('../models/sketchbook.server.model');
var Paper = require('../models/sketchbook.server.model');
var Room = require('../models/room.server.model');
var base64 = require('node-base64-image');
fs = require('fs');
var async = require('async');


// 입력단어 저장하기
// PUT /guessword/1/
exports.createPaper = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  // 이미지 파일명 셋팅
  var date = new Date();
  var dateString = date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds();

  var paperId = '';
  async.series([
    function(callback) {

      var paper = new Paper({
        userId: req.body.userId,
        type: req.body.type,
        answer: req.body.answer,
        picture: '',
        score: req.body.score
      });
      paper.save(function(err) {
        if (err) {
          return res.sendStatus(500);
        }
        Paper.findById(paper, function(err, doc) {
          if (err) return handleError(err);
          paperId = doc._id;
          callback(null, doc);
        });
      });
    },
    function(callback) {
      Sketchbook.update({
        _id: req.params.sketchbookId
      }, {
        $addToSet: {
          papers: {
            paperId: paperId,
            userId: req.body.userId,
            type: req.body.type,
            answer: req.body.answer,
            picture: '',
            score: req.body.score
          }
        }
      }, {
        upsert: true
      }, function(err, result) {
        callback(null, result);
      });
    }
  ], function(err, result) {
    res.send(result.papers);
  });
};
