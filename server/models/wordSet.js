var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var wordSetSchema = new Schema({
  _id: ShortId,
  value: String,
  seq: String,
  useYn : String,
  roomNo : String,
  date: { type: Date, default: Date.now }
});

var WordSet = mongoose.model('WordSet', wordSetSchema);

module.exports = WordSet;
