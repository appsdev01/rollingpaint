var router = require('express').Router();
var User = require('../models/user.server.models');

// 내 정보 조회하기
// GET /users/me
router.get('/me', function(req, res) {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.sendStatus(401);
  }
});

// 사용자 조회
// GET /user/{userid}
router.get('/:id', function(req, res, next) {
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    res.send(user);
  });
});

module.exports = router;
