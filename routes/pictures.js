var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/rollingpaint';

// Create a picture
router.post('/', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  MongoClient.connect(url, function(err, db) {
    db.collection('pictures').insert({title : req.body.title}, function(err, result) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.send(result.ops);
      db.close();
    });
  });
});

// Find all pictures
router.get('/', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    db.collection('pictures').find({}).toArray(function(err, doc) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.send(doc);
      db.close();
    });
  });
});

// Find a pictures
router.get('/:id', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    db.collection('pictures').findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.send(doc);
      db.close();
    });
  });
});

// Update a picture
router.put('/:id', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  MongoClient.connect(url, function(err, db) {
    db.collection('pictures').update({_id: new ObjectID(req.params.id)}, {$set: {title: req.body.title}}, function(err, doc) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.send(doc);
      db.close();
    });
  });
});

// Delete a picture
router.delete('/:id', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    db.collection('pictures').remove({_id: new ObjectID(req.params.id)}, function(err, result) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.send(result);
      db.close();
    });
  });
});

module.exports = router;
