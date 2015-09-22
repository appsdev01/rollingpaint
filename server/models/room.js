var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

// var gameUserSchema = new Schema({
//   userId: ShortId,
//   ready: Boolean, // true:ready, false:not ready
// });

var roomSchema = new Schema({
  _id: ShortId,
  title: String,
  password: String, // null default
  capacity: Number,
  ownerId: String,
  status: String, // 01: opened(default), 02: playing, 03: ended
  wordseed: String, // random value
  gameround: Number, // 1(default)
  users: [ShortId], // ownerId default
  sketchbooks: [ShortId], // status(02) > game
  date: { type: Date, default: Date.now }
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
