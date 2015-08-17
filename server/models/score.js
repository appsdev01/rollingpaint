var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scoreSchema = new Schema({
  roomid: String,
  userid: String,
  gamescore: Number,
  popularityscore : Number
});

var Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
