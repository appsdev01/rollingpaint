var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pictureSchema = new Schema({
  url: String,
  date: { type: Date, default: Date.now }
});

var Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;
