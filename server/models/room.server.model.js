var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var Schema = mongoose.Schema;

var GameUserSchema = new Schema({
  _id: ShortId,
  username: String,
  readyStatus: String
});

var RoomSchema = new Schema({
  _id: ShortId,
  title: String,
  password: String, // null default
  capacity: Number,
  ownerId: String,
  status: String, // 01: opened(default), 02: playing, 03: ended
  wordseed: String, // random value
  gameround: Number, // 1(default)
  users: [GameUserSchema], // ownerId default
  sketchbooks: [ShortId], // status(02) > game
  date: {
    type: Date,
    default: Date.now
  }
});

if (!RoomSchema.options.toJSON) {
  RoomSchema.options.toJSON = {};
}
RoomSchema.options.toJSON.transform = function(doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

var Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
