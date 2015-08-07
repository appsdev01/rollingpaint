var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wordSchema = new Schema({
  value: String,
  seq: String,
  date: { type: Date, default: Date.now }
});

var Word = mongoose.model('Word', wordSchema);

module.exports = Word;
