var router = require('express').Router();
var Word = require('../models/word.js');
var async = require('async');
var shuffle = require('knuth-shuffle-seeded');
var assert = require('assert');

//var url = 'mongodb://70.30.14.125:27017/rollingpaint';

// Create a Word
router.post('/', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  console.log(req.body);
  var seqNo = 0;
  var word = new Word({
    value: req.body.value
  });
  console.log("word : " + word);
  word.save(function(err) {
    if (err) {
      return res.sendStatus(500);
    }
    Word.find(function(err, results) {
      console.log("results : " + results);
      seqNo = results.length;
      Word.update(word, {
        seq: seqNo
      }, function(err, result) {
        //  res.send(result);
      });
    });

    Word.findById(word, function(err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    });
  });

});

// Find all Words
router.get('/', function(req, res, next) {

  Word.find(function(err, results) {
    console.log(results);
    res.send(results);
  });
});

// Create WordSets
router.get('/wordList/:roomNo/users/:userSeq', function(req, res, next) {

  var shuffle_array = [];
  var roomNum = req.params.roomNo;
  var userSeq = req.params.userSeq;
  var cardNum = 4;
  var seq = 0;
  var wordListStr = "";
  var reset_array = [];

  for (var i = 0; i < 27; i++) {
    shuffle_array[i] = i + 1;
  }
  shuffle_array = shuffle(shuffle_array.slice(0), roomNum);
  console.log("===============================================");
  console.log("roomNum : " + roomNum + " after array : " + shuffle_array);
  var fromSeq = cardNum * (userSeq - 1);
  /*
  var toSeq = (cardNum * (userSeq - 1)) + (cardNum - 1);
  console.log("from : " + fromSeq + " to : " + toSeq);
  console.log("from : " + shuffle_array[fromSeq] + " to : " + shuffle_array[toSeq]);
  */
  async.series([
      function(callback) {
        Word.find(function(err, results) {
          //console.log("results : " + results);
          if (results !== null) {
            for (var k = 0; k < cardNum; k++) {
              reset_array[k] = results[shuffle_array[fromSeq++]].value;
            }
            callback(null, reset_array);
          } else {
            callback(null, "No words");
          }
        });
      }
    ],
    function(err, results) {
      if (!err) {
        res.send(results);
      }
    });
});


// Update a Word
router.put('/:id', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  Word.update({
    _id: req.params.id
  }, {
    value: req.body.value
  }, function(err, result) {
    res.send(result);
  });
});

// Delete a Word
router.delete('/:id', function(req, res, next) {
  Word.remove({
    _id: req.params.id
  }, function(err, result) {
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
