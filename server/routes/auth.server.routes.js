var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.server.model');

module.exports = function(app) {

  app.route('/register').post(function(req, res, next) {
    if (!req.body) {
      return res.sendStatus(400);
    }
    console.log('email ' + req.body.email);
    var member = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });
    member.save(function(err) {
      if (err) {
        return res.sendStatus(500);
      }

      User.findById(member, function(err, doc) {
        if (err) return handleError(err);
        res.send(doc);
      });
    });
  });

  app.route('/editprofile').post(function(req, res, next) {
    if (!req.body) {
      return res.sendStatus(400);
    }

      User.findByIdAndUpdate(req.body.userId,  {
        $set: {
            username: req.body.username
        }
    }, function(err, doc) {
        if (err) return handleError(err);
        res.send(doc);
      });
  });

  app.route('/login')
  .post(
    passport.authenticate('local', {
    successRedirect: '/#/lobby',
    failureRedirect: '/#/intro'
  }));

  // auth configuration
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      console.log("Login email: " + email);
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          console.log("err");
          return done(err);
        }
        if (!user) {
          console.log("user undefined");
          return done(null, false);
        }
        if (user.password != password) {
          console.log("password invalid");
          return done(null, false);
        }
        console.log('success');
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

};
