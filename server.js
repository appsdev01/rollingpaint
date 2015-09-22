var express = require('express'),
  app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

var auth = require('./server/routes/auth');
var chats = require('./server/routes/chats');
var guesswords = require('./server/routes/guesswords');
var paints = require('./server/routes/pictures');
var rooms = require('./server/routes/rooms');
var scores = require('./server/routes/scores');
var users = require('./server/routes/users');
var words = require('./server/routes/words');
var sketchbooks = require('./server/routes/sketchbooks');

var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB || 'mongodb://localhost/rollingpaint');
mongoose.connection.on('connected', function() {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', function() {
  console.log('[ERROR] Failed connecting to MongoDB');
});

app.use(express.static('www'));
app.use(cookieParser('your secret here'));
app.use(session());
app.use(passport.initialize());
app.use(passport.session());
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
app.use('/auth', auth);

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.set('port', process.env.PORT || 80);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// API Routes
// app.get('/blah', routeHandler);
