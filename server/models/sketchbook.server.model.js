var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var paperSchema = new mongoose.Schema({
  _id: ShortId,
  userId: String,
  type: String, //"picture" or "answer" or "word"
  answer: String,
  picture: String,
  score: String,
  date: {
    type: Date,
    default: Date.now
  }
});

if (!paperSchema.options.toJSON) {
  paperSchema.options.toJSON = {};
}
paperSchema.options.toJSON.transform = function(doc, ret, options) {
  delete ret._id;
};

var sketchbookSchema = new mongoose.Schema({
  _id: ShortId,
  ownerId: String,
  papers: [paperSchema],
  word: String,
  date: {
    type: Date,
    default: Date.now
  }
});

if (!sketchbookSchema.options.toJSON) {
  sketchbookSchema.options.toJSON = {};
}
sketchbookSchema.options.toJSON.transform = function(doc, ret, options) {
  delete ret._id;
};


var Sketchbook = mongoose.model('sketchbook', sketchbookSchema);

module.exports = Sketchbook;
