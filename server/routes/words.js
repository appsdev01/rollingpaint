var router = require('express').Router();
var Word = require('../models/word.js');

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
    })
  });

});

// Find all Words
router.get('/', function(req, res, next) {
  Word.find(function(err, results) {
    console.log(results);
    res.send(results);
  });
});

// Find a Words
router.get('/:seq', function(req, res, next) {

  var flag = 0;
  var arrays = [];
  while(flag < 6){
    var randomNo = Math.floor(Math.random()*10)+1;
    Word.findOne( {seq : randomNo}, function(err, result) {
      //res.send(result);
      console.log("value : " + result.value);
      arrays[flag] = result.value;
    });
    flag++;
  }
  console.log(arrays.length);
  console.log(arrays);
  res.send(arrays);
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
