var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ShortId = require('mongoose-minid');

var PictureSchema = new Schema({
  _id: ShortId,
  url: String,
  created: {
    type: Date,
    default: Date.now
  }
});

var Picture = mongoose.model('Picture', PictureSchema);
module.exports = Picture;
