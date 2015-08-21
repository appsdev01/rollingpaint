var router = require('express').Router();
var Word = require('../models/word.js');
var WordSet = require('../models/wordSet.js');
var async = require('async');

//var url = 'mongodb://70.30.14.125:27017/rollingpaint';

// Create a Word
router.post('/', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  console.log(req.body);

  var seqNo = 0;

  var word = new Word({ value: req.body.value });

  word.save(function (err) {
    if (err) {
      return res.sendStatus(500);
    }

    Word.find(function(err, results) {
      //console.log(results.length + 1);
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

// Find WordSets by roomNum
router.get('/:roomNo', function(req, res, next) {
  var cardSet = "";
  async.series([
    function(callback){
      WordSet.findOne({roomNo : req.params.roomNo, useYn : "N"}, function(err, result1) {
        if(result1 === null){
          res.send("No results !!!!!!!");
          return;
        }
        cardSet = result1.value.split('/');

        console.log("cardSet : " + cardSet);
        WordSet.update(result1, {useYn: "Y"}, function(err, result2) {
          if (err) return handleError(err);
        });
        callback(null, cardSet);
      });
    }
  ],
  function(err, results){
    if(!err){
      res.send(results);
    }
  });
});

// Create WordSets
router.post('/:roomNo', function(req, res, next) {

  var random_array = [];
  var result_array = [];
  var size = 100;
  var random_number;
  var temp_value;
  var roomNum = req.params.roomNo;

  async.series([

    function(callback){
      Word.find(function(err, results) {
        size = results.length;
        console.log("size : " + size);

        for(var j=0; j< results.length; j ++){
          random_array[j] = results[j].value;
        }
        console.log("before swapping : " + random_array);
        callback(null, null);
      });
    },

    function(callback){
      for( i = size - 1; i > 0; i-- ){
        random_number = (Math.floor(Math.random()*size)+1) % i;
        // swap
        temp_value = random_array[i];
        random_array[i] = random_array[random_number];
        random_array[random_number] = temp_value;
      }
      console.log("after swapping : " + random_array);
      callback(null, null);

    },
    function(callback){
      var personNum = 4;  // 사람 수
      var cardNum = 3;  // 카드 수
      var startPoint = 0;

      for(var j=0; j<personNum; j++){ // 사람 수
        var cardSet = "";
        var seq = 0;
        for(var i = startPoint; i< startPoint + cardNum; i++){ // 카드 수
          cardSet +=  random_array[i] + "/";
        }
        startPoint = startPoint +  cardNum;

        var wordSet = new WordSet({ value : cardSet, useYn : "N", roomNo : roomNum });
        wordSet.save(function (err, results) {
          if (err) {
            return res.sendStatus(500);
          }
          console.log("results : " + results.value);
          callback(null, results.value);
        });
      }
    }
  ],
  // optional callback
  function(err, results){
    if( !err){
      res.send("successed!!!!!!");
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
