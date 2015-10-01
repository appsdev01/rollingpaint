var express = require('express'),
  app = express();
var server = require('http').Server(app);
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

// TODO: MongoDB 설정 외부 처리
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

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.set('port', process.env.PORT || 80);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// TODO: 아래 방식으로 변경
var auth = require('./server/routes/auth');
var guesswords = require('./server/routes/guesswords');
var scores = require('./server/routes/scores');
var users = require('./server/routes/users');
var rooms = require('./server/routes/rooms');
var words = require('./server/routes/words');
var sketchbooks = require('./server/routes/sketchbooks');

app.use('/auth', auth);
app.use('/scores', scores);
app.use('/users', users);
app.use('/rooms', rooms);
app.use('/words', words);
app.use('/sketchbooks', sketchbooks);

// 컴포넌트별 라우터 로딩 - 각 컴포넌트 라우터는 내부에서 직접 경로를 설정
require('./server/routes/pictures.server.routes')(app);
require('./server/routes/chats.server.routes')(app, server);
