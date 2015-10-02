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

if (!PictureSchema.options.toJSON) PictureSchema.options.toJSON = {};
PictureSchema.options.toJSON.transform = function(doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

var Picture = mongoose.model('Picture', PictureSchema);
module.exports = Picture;
