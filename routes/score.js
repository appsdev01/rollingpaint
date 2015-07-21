var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
   , assert = require('assert');

var url = 'mongodb://70.30.14.125:27017/rollingpaint';

router.post('/:name', function(req, res, next) {
  MongoClient.connect(url, function(err, db){
    console.log("");
    db.collection('score').insert([
    {name : req.params.name,
     score : 1 }], function(err, result) {

    });
    db.close();
   });
  res.send('Save' + req.params.name);
});


module.exports = router;
