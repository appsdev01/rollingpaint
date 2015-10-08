var router = require('express').Router();
var Word = require('../models/word.js');
var Room = require('../models/room.server.model.js');
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
  /*
    Word.find(function(err, results) {
      console.log(results);
      res.send(results);
    });
  */

});

// Create WordSets
router.get('/wordList/:roomid/users/:userSeq', function(req, res, next) {

  var shuffle_array = [];
  var roomNum = req.params.roomid;
  var userSeq = req.params.userSeq;
  var cardNum = 4;
  var seqNum = 0;
  var wordListStr = "";
  var reset_array = [];
  var wordseed;
  var fromSeq = 0;

  for (var i = 0; i < 27; i++) {
    shuffle_array[i] = i + 1;
  }
  async.series([
      function(callback) {
        Room.findById(roomNum, function(err, doc) {

          console.log("roomNum : " + roomNum);
          if (err) return handleError(err);
          wordseed = doc.wordseed;
          shuffle_array = shuffle(shuffle_array.slice(0), wordseed);
          console.log("===============================================");
          console.log("wordseed : " + wordseed + " after array : " + shuffle_array);
          fromSeq = cardNum * (userSeq - 1);
          var toSeq = (cardNum * (userSeq - 1)) + (cardNum - 1);
          console.log("from : " + shuffle_array[fromSeq] + " to : " + shuffle_array[toSeq]);
          callback(null, null);
        });
      },
      function(callback) {
        console.log(" fromSeq : " + fromSeq);
        console.log(" shuffle_array : " + shuffle_array);
        Word.find({
          seq: shuffle_array[fromSeq++]
        }, function(err, doc) {
          if (err) return handleError(err);
          //console.log("doc : " + doc);
          reset_array[0] = doc;
        });

        Word.find({
          seq: shuffle_array[fromSeq++]
        }, function(err, doc) {
          if (err) return handleError(err);
          reset_array[1] = doc;
        });

        Word.find({
          seq: shuffle_array[fromSeq++]
        }, function(err, doc) {
          if (err) return handleError(err);
          reset_array[2] = doc;
        });

        Word.find({
          seq: shuffle_array[fromSeq++]
        }, function(err, doc) {
          if (err) return handleError(err);
          reset_array[3] = doc;
          console.log("Before calling callback");
          callback(null, reset_array);
        });
      },
    ],
    function(err, results) {
      console.log("results : " + results[1]);
      if (!err) {
        res.send(results[1]);
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
