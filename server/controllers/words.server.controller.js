var Word = require('../models/word.server.model');
var Room = require('../models/room.server.model');
var async = require('async');
var shuffle = require('knuth-shuffle-seeded');
var assert = require('assert');

//var url = 'mongodb://70.30.14.125:27017/rollingpaint';

// Create a Word
exports.create = function(req, res) {
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

};

// Find all Words
exports.get = function(req, res) {
  /*
    Word.find(function(err, results) {
      console.log(results);
      res.send(results);
    });
  */

};

// Create WordSets
exports.get = function(req, res) {

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

          console.log("\n\n\n\n\n\nroomNum : " + roomNum);
          //console.log("doc.wordseed : " + doc.wordseed);
          if (err) return handleError(err);
          wordseed = doc.wordseed;
          shuffle_array = shuffle(shuffle_array.slice(0), wordseed);
          //console.log("===============================================");
          //console.log("wordseed : " + wordseed + " after array : " + shuffle_array);
          fromSeq = cardNum * (userSeq - 1);
          var toSeq = (cardNum * (userSeq - 1)) + (cardNum - 1);
          //console.log("from : " + shuffle_array[fromSeq] + " to : " + shuffle_array[toSeq]);
          callback(null, reset_array);
        });
      },
      function(callback) {
        //console.log(" fromSeq : " + fromSeq);
        //console.log(" shuffle_array : " + shuffle_array);
        Word.find().where("seq").in(shuffle_array.slice(fromSeq, fromSeq+4)).select("value").exec(function(err, doc) {
          if (err) return handleError(err);
          console.log("doc : " + doc);
          console.log("doc1 : " + doc[0].value);
          reset_array[0] = doc;
          callback(null, null);
        });
      }
    ],
    function(err, results) {
      console.log("results : " + results);
      if (!err) {
        res.send(results[0]);
      }
    });
};


// Update a Word
exports.update = function(req, res) {
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
};

// Delete a Word
exports.delete = function(req, res) {
  Word.remove({
    _id: req.params.id
  }, function(err, result) {
    console.log(result);
    res.send(result);
  });
};
