var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var scoreSchema = new mongoose.Schema({
  _id: ShortId,
  roomid: String,
  users : {userid: String, gamescore: Number, popularityscore : Number}
});

var Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
