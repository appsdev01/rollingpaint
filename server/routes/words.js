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
  var word = new Word({ value: req.body.value });
  console.log("word : " + word);
  word.save(function (err) {
    if (err) {
      return res.sendStatus(500);
    }
    Word.find(function(err, results) {
      console.log("results : " + results);
      seqNo = results.length;
      Word.update(word, {seq: seqNo}, function(err, result) {
        //  res.send(result);
      });
    });

    Word.findById(word, function (err, doc) {
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
  var cardNum = 3;
  var seq = 0;
  var wordListStr ="";
  var reset_array = [];

  async.series([
    function(callback){
      Word.find(function(err, results) {
        shuffle_array = shuffle(results.slice(0), roomNum);
        for(var k=0; k< shuffle_array.length; k ++){
          wordListStr += shuffle_array[k].value + "/";
          if(k !== 0 && k % cardNum === cardNum-1){
            reset_array[seq++] = wordListStr;
            console.log("array : " + reset_array[seq-1]);
            wordListStr = "";
          }
        }
        if(reset_array !== null){
          callback(null, reset_array[userSeq].split('/'));
        } else{
          callback(null, "No words");
        }
      });
    }
  ],
  function(err, results){
    if(!err){
      res.send(results);
    }
  });
});


// Update a Word
router.put('/:id', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  Word.update({_id: req.params.id}, {value: req.body.value}, function(err, result) {
    res.send(result);
  });
});

// Delete a Word
router.delete('/:id', function(req, res, next) {
  Word.remove({_id: req.params.id}, function(err, result) {
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
