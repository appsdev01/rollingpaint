var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/rollingpaint';

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");

    // Find some documents
    db.collection('user').find({}).toArray(function(err, doc) {
      console.log("Found the following records");
      console.dir(doc);
      res.send(doc);
      db.close();
    });
  });
});

router.get('/test', function(req, res, next) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    db.close();
  });

  res.send('hello');
});

router.get('/:name', function(req, res, next) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");

    // Find some documents
    db.collection('user').findOne({name: req.params.name}, function(err, doc) {
      console.log("Found the following records");
      console.dir(doc);
      res.send(doc);

      db.close();
    });

  });
});

router.post('/:name', function(req, res, next) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");

    // Insert some documents
    db.collection('user').insert([
      {name : req.params.name}
    ], function(err, result) {

    });

    db.close();
  });

  res.send('Save ' + req.params.name);
});

router.delete('/:name', function(req, res, next) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");

    // Insert some documents
    db.collection('user').remove({name: req.params.name}, function(err, result) {
      console.log("deleted " + req.params.name);
      db.close();
    });
  });

  res.send('Save ' + req.params.name);
});

module.exports = router;
