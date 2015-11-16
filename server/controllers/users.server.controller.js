var User = require('../models/user.server.model');

exports.me = function(req, res) {
  if (req.isAuthenticated()) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
      res.send(user);
    });
  } else {
    res.sendStatus(401);
  }
};

exports.get = function(req, res) {
  User.findOne({
    _id: req.params.userId
  }, function(err, user) {
    res.send(user);
  });
};
