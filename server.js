var express = require('express'),
  app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

var chats = require('./server/routes/chats');
var guesswords = require('./server/routes/guesswords');
var paints = require('./server/routes/pictures');
var rooms = require('./server/routes/rooms');
var scores = require('./server/routes/scores');
var users = require('./server/routes/users');
var words = require('./server/routes/words');
var sketchbooks = require('./server/routes/sketchbooks');

var auth = require('./server/routes/auth');
var User = require('./server/models/user.js');

var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect(process.env.MONGODB || 'mongodb://localhost/rollingpaint');
mongoose.connection.on('connected', function() {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', function() {
  console.log('[ERROR] Failed connecting to MongoDB');
});

// broadcasting
io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});

app.use(express.static('www'));
app.use(cookieParser('your secret here'));
app.use(session());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded

app.use('/scores', scores);
app.use('/users', users);
app.use('/chats', chats);
app.use('/rooms', rooms);
app.use('/pictures', paints);
app.use('/words', words);
app.use('/sketchbooks', sketchbooks);


app.use(passport.initialize());
app.use(passport.session());

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// API Routes
// app.get('/blah', routeHandler);

app.set('port', process.env.PORT || 80);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

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
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log("serialize");
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserialize");
  done(null, user);
});

// API Routes
// app.get('/blah', routeHandler);

app.get('/login_success', ensureAuthenticated, function(req, res) {
  console.log(req.user);
  res.redirect('/#/lobby');
});

function ensureAuthenticated(req, res, next) {
  // 로그인이 되어 있으면, 다음 파이프라인으로 진행
  if (req.isAuthenticated()) {
    return next();
  }
  // 로그인이 안되어 있으면, login 페이지로 진행
  res.redirect('/');
}

app.post('/login',
  passport.authenticate('local', { successRedirect: '/#/lobby',
                                   failureRedirect: '/#/intro'})
);

app.post('/register', function(req, res, next) {
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
