var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var PaperSchema = new mongoose.Schema({
  _id: ShortId,
  userId: String,
  type: String, //"picture" or "answer" or "word"
  answer: String,
  picture: String,
  score: String,
  date: { type: Date, default: Date.now }
});

var sketchbookSchema = new mongoose.Schema({
  _id: ShortId,
  ownerId: String,
  papers: [PaperSchema],
  word: String,
  date: { type: Date, default: Date.now }
});


var Sketchbook = mongoose.model('sketchbook', sketchbookSchema);

module.exports = Sketchbook;
