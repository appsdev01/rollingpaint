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
var Room = require('../models/room.server.model');
var base64 = require('node-base64-image');
fs = require('fs');
var async = require('async');

// Create a sketchbook
/*
router.post('/:userId', function(req, res, next) {
if (!req.body) {
return res.sendStatus(400);
}
console.log(req.body);
var sketchbook = new Sketchbook({
userId: req.params.userId,
word : req.body.word,
paper : req.body.paper,
type : req.body.type
});

sketchbook.save(function (err) {
if (err) {
return res.sendStatus(500);
}
});
});
*/

// 턴 지정하기
// POST /sketchbook/1(스케치북 id)/paper/1/

exports.createSketchbook = function(req, res, next) {

  console.log("::::::::::::::: createSketchbook !!!!!!!!!!!!!!");
  var sketchbookId = "";

  async.series([
    function(callback) {
      var sketchbook = new Sketchbook({
        ownerId: req.params.userId, // 스케치북 주인
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
    }
  ], function(err, result) {
    console.log("sketchbookId : " + sketchbookId);
    res.send(sketchbookId);
  });

};

exports.countTurn = function(req, res) {

  console.log(req.body);

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
    console.log("result : " + result);
    res.send(result);
  });
};


// 스케치북 조회하기
// GET /skethbook/1/
exports.getSketchbook = function(req, res, next) {
  Sketchbook.findOne({
    userId: req.params.userId
  }, function(err, results) {
    if (!err) {
      console.log("results : " + results);
      res.send(results);
    }
  });
};

exports.savePaperImage = function(req, res) {
  console.log("savePaperImage in!");
//  console.log(req.body.dataURL);

  // 이미지 파일명 셋팅
  var date = new Date();
  var dateString = date.getFullYear() + "" + (date.getMonth()+1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds();
  var staticPath = 'www/img/sketchbookImg/sketchbook_'; // sketchbook_timestamp.png

  var tmp = req.body.dataURL;
  var replaceDataUrl = tmp.replace(/^data:image\/\w+;base64,/, "");
  var imageData = new Buffer(replaceDataUrl, 'base64');

  var options = {filename: staticPath + dateString}; // 저장할경로/파일명.png


  base64.base64decoder(imageData, options, function(err, saved) {
    if (err) {
      console.log(err);
    }
    console.log('\n\n options.filename = ' + options.filename);
    console.log('\n\n saved = ' + saved);
  });

  //  fs.writeFile('image.png', buf);
  //  window.open('image.png');
  if (!req.body) {
    return res.sendStatus(400);
  }
};
