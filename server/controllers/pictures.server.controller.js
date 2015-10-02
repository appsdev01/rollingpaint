var Picture = require('../models/picture.server.model');

exports.create = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  var picture = new Picture({
    url: req.body.url
  });
  picture.save(function(err) {
    if (err) {
      return res.sendStatus(500);
    }
    Picture.findById(picture, function(err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    });
  });
};

exports.get = function(req, res) {
  Picture.findById(req.params.pictureId, function(err, result) {
    res.send(result);
  });
};

exports.list = function(req, res) {
  Picture.find(function(err, results) {
    res.send(results);
  });
};

exports.update = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  Picture.update({
    _id: req.params.pictureId
  }, {
    url: req.body.url
  }, function(err, result) {
    res.send(result);
  });
};

exports.delete = function(req, res) {
  Picture.remove({
    _id: req.params.pictureId
  }, function(err, result) {
    console.log(result);
    res.send(result);
  });
};
