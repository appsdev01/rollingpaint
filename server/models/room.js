var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var gameUserSchema = new Schema({
  userId: ShortId,
  word: String,
  score: Number
});

var roomSchema = new Schema({
  _id: ShortId,
  title: String,
  password: String,
  capacity: Number,
  ownerId: String,
  status: String, // 01: opened, 02: playing, 03: ended
  step: Number,
  users: [gameUserSchema],
  date: { type: Date, default: Date.now }
});

var Room = mongoose.model('Room', roomSchema);

module.expert = Room;
