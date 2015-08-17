var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var gameUserSchema = new Schema({
  _id: ShortId,
  word: String,
  score: Number,
  profileImage: String // Profile Image Url
});

var roomSchema = new Schema({
  _id: ShortId,
  title: String,
  capacity: Number,
  owner: {
    _id : ShortId
  },
  status: String, // 01: opened, 02: playing, 03: ended
  step: Number,
  users: [gameUserSchema],
  date: Date
});

var Room = mongoose.model('Room', roomSchema);

module.expert = Room;
