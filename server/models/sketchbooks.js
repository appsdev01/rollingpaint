var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var sketchbookSchema = new Schema({
  _id: ShortId,
  userId: String,
  paper: String,
  word: String,
  type: String,
  data: String,
  score: String,
  date: { type: Date, default: Date.now }
});

var Sketchbook = mongoose.model('sketchbook', sketchbookSchema);

module.exports = Sketchbook;
