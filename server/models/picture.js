var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var pictureSchema = new mongoose.Schema({
  _id: ShortId,
  url: String,
  date: { type: Date, default: Date.now }
});

var Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;
