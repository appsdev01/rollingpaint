var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;


var scorelistSchema = new mongoose.Schema({
    userid: String,
    gamescore: Number,
    popularityscore: Number
  });

var scoreSchema = new mongoose.Schema({
  _id: String,
  users : [scorelistSchema]
});

var Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
