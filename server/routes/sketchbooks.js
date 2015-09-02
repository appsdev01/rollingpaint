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

var router = require('express').Router();
var Sketchbook = require('../models/sketchbook.js');
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
// POST /sketchbook/1/paper/1/

router.post('/:userId/paper/:paper', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  console.log(req.body);
  var sketchbook = new Sketchbook({
    userId: req.params.userId,
    word : req.body.word,
    paper : { userId: req.params.userId,
              type : req.body.type
    },
    score : req.body.score,
    data : req.body.data
  });

console.log(sketchbook);

  sketchbook.save(function (err) {
    if (err) {
      return res.sendStatus(500);
    }
    Sketchbook.findById(sketchbook, function (err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    });
  });
});


// 스케치북 조회하기
// GET /skethbook/1/
router.get('/:userId', function(req, res, next) {
  Sketchbook.findOne({userId : req.params.userId}, function(err, results) {
    if(!err){
      console.log("results : " + results);
      res.send(results);
    }
  });
});


module.exports = router;
