var express = require('express'),
    app = express();

var score = require('./routes/score');
var users = require('./routes/users');
var chats = require('./routes/chats');
var bodyParser = require('body-parser');

app.use(express.static('www'));
app.use('/score', score);
app.use('/users', users);
app.use('/chats', chats);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// API Routes
// app.get('/blah', routeHandler);

app.set('port', process.env.PORT || 80);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
