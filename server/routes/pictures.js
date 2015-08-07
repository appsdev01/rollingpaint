var router = require('express').Router();
var Picture = require('../models/picture');

// Create a picture
router.post('/', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  var picture = new Picture({ url: req.body.url });
  picture.save(function (err) {
    if (err) {
      return res.sendStatus(500);
    }

    Picture.findById(picture, function (err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    })
  });
});

// Find all pictures
router.get('/', function(req, res, next) {
  Picture.find(function(err, results) {
    res.send(results);
  });
});

// Find a pictures
router.get('/:id', function(req, res, next) {
  Picture.findById(req.params.id, function(err, result) {
    res.send(result);
  });
});

// Update a picture
router.put('/:id', function(req, res, next) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  Picture.update({_id: req.params.id}, {url: req.body.url}, function(err, result) {
    res.send(result);
  });
});

// Delete a picture
router.delete('/:id', function(req, res, next) {
  Picture.remove({_id: req.params.id}, function(err, result) {
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
