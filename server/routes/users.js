var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  User.findOne({_id: req.params.id}, function (err, user) {

  });
});


module.exports = router;
