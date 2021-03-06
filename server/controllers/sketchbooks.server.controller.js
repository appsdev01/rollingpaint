// sehee88
// Sketchbook CRUD
/*
POST /sketchbook/1/word
//request
{
"word": "apple"
}

// 턴 지정하기
POST /sketchbook/1/paper/1/
{
"type": "picture" or "answer" or "word"
"userId": "B",
"data": "http:~~.jpg" or "answer"
"score": 0 //default userId
}

// 스케치북 조회하기
GET /skethbook/1/
//response
{
// 저장된 스키마를 그대로 조회하여 화면에서 분리 (angular JS에서)
}
*/

var Sketchbook = require('../models/sketchbook.server.model');
var Paper = require('../models/sketchbook.server.model');
var Room = require('../models/room.server.model');
var base64 = require('node-base64-image');
fs = require('fs');
var async = require('async');

// 스케치북 생성하기
// POST /sketchbook/1
exports.create = function(req, res, next) {
  var sketchbookId = "";

  async.series([
    function(callback) {
      var sketchbook = new Sketchbook({
        ownerId: req.body.userId, // 스케치북 주인
      });
      sketchbook.save(function(err) {
        if (err) {
          return res.sendStatus(500);
        }
        Sketchbook.findById(sketchbook, function(err, doc) {
          if (err) return handleError(err);
          sketchbookId = doc._id;
          callback(null, doc);
        });
      });
    },
    function(callback) {
      Room.update({
        _id: req.body.roomId
      }, {
        $addToSet: {
          sketchbooks: sketchbookId
        }
      }, {
        upsert: true
      }, function(err, result) {
        callback(null, result);
      });
    },
    function(callback) {
      Room.findById(req.body.roomId, function(err, room) {
        if (err) return handleError(err);

        room.players.map(function(player) {
          if (player.userId === req.body.userId) {
            player.sketchbook = sketchbookId;
          }
        });

        room.save(function (err) {
          if (err) return handleError(err);
          callback(null, room);
        });
      });
    }
  ], function(err, result) {
    res.send(sketchbookId);
  });

};

// 턴 지정하기
// POST /sketchbook/1(스케치북 id)/paper/1/
exports.countTurn = function(req, res) {
  Sketchbook.update({
    _id: req.params.sketchbookId
  }, {
    $addToSet: {
      papers: {
        userId: req.body.ownerId,
        type: req.body.type
      },
      word: req.body.word
    }
  }, {
    upsert: true
  }, function(err, result) {
    res.send(result);
  });
};


// 스케치북 조회하기
// GET /skethbook/1/
exports.get = function(req, res, next) {
  Sketchbook.findOne({
    userId: req.params.userId
  }, function(err, results) {
    if (!err) {
      res.send(results);
    }
  });
};

// 스케치북 수정하기
// PUT /skethbook/1/
exports.update = function(req, res, next) {
  Sketchbook.update({
    _id: req.params.sketchbookId
  }, {
    word: req.body.word
  }, function(err, result) {
    res.send(result);
  });

};

// 스케치북 삭제하기
// DELETE /skethbook/1/
exports.delete = function(req, res, next) {};

// 스케치북 조회하기
// GET /skethbook/1/
exports.listPaper = function(req, res, next) {
  Sketchbook.findOne({
    _id: req.params.sketchbookId
  }, function(err, results) {
    if (!err) {
      res.send(results);
    }
  });
};

// 페이서 생성하기
// POST /skethbook/1/
exports.createPaper = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  // 이미지 파일명 셋팅
  var date = new Date();
  var dateString = date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds();
  var staticPath = '/tempSketchbookImage/sketchbook_'; // sketchbook_timestamp.png
  var imgUrl = req.body.picture;
  var replaceDataUrl = imgUrl.replace(/^data:image\/\w+;base64,/, "");
  var imageData = new Buffer(replaceDataUrl, 'base64');

  var fileFullPath = {
    filename: 'www' + staticPath + dateString // 저장할경로/파일명.png
  };
  var filePath = staticPath + dateString;

  var paperId = '';
  async.series([
    function(callback) {

      //로컬에 이미지 저장
      base64.base64decoder(imageData, fileFullPath, function(err, saved) {
        if (err) {
          console.log(err);
        }
        console.log('\n\n fileFullPath.filename = ' + fileFullPath.filename);
        console.log('\n\n saved = ' + saved);
        //res.send(saved);
      });

      var paper = new Paper({
        userId: req.body.userId,
        type: req.body.type,
        answer: req.body.answer,
        picture: filePath,
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
            picture: filePath,
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

// 페이퍼 조회하기
// get /skethbook/1/paper/1
exports.getPaper = function(req, res, next) {};

// 페이퍼 수정하기
// put /skethbook/1/paper/1
exports.updatePaper = function(req, res, next) {};

// 페이퍼 삭제하기
// DELETE /skethbook/1/paper/1
exports.deletePaper = function(req, res, next) {};
