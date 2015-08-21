var router = require('express').Router();
var Word = require('../models/word.js');
var WordSet = require('../models/wordSet.js');
var async = require('async');

//var url = 'mongodb://70.30.14.125:27017/rollingpaint';

// Create a WordSet
router.post('/', function(req, res, next) {

});

// Find all WordSet
router.get('/', function(req, res, next) {
  WordSet.find(function(err, results) {
    console.log(results);
    res.send(results);
  });
});

// Find a WordSet
router.get('/:seq', function(req, res, next) {
});


// Update a WordSet
router.put('/:id', function(req, res, next) {
});

// Delete a WordSet
router.delete('/:id', function(req, res, next) {
  WordSet.remove({_id: req.params.id}, function(err, result) {
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
