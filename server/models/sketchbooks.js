var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var paperSchema = new mongoose.Schema({
  _id: ShortId,
  userId: String,
  type: String,
  data: String,
  score: String,
  date: { type: Date, default: Date.now }
});

var sketchbookSchema = new mongoose.Schema({
  _id: ShortId,
  userId: String,
  paper: [paperSchema],
  word: String,
  date: { type: Date, default: Date.now }
});


var Sketchbook = mongoose.model('sketchbook', sketchbookSchema);

module.exports = Sketchbook;
