var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var wordSchema = new Schema({
  _id: ShortId,
  value: String,
  seq: String,
  date: { type: Date, default: Date.now }
});

var Word = mongoose.model('Word', wordSchema);

module.exports = Word;
