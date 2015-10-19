var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var GameUserSchema = new Schema({
  _id: ShortId,
  username: String,
  readyStatus: String,
  joinedDate: {
    type: Date,
    default: Date.now
  }
});

// readyStatus ---> playStatus로 변경했으면 합니다.
// 01: 게임 대기
// 02: 게임 준비 (방장은 입장 후 바로 준비 완료 상태)
// 03: 단어 선택
// 04: 그림 그리기
// 05: 단어 맞추기
// 06: 점수 주기
// 10: 연결 끊김

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

RoomSchema.pre('save', function(next) {
  var room = this;

  console.log('Room pre-save');
  console.log(room);

  // 패스워드가 없거나 변경되지 않은 경우 무시
  if (!room.get('password') || !room.isModified('password')) return next();

  // SALT 생성
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // 새로 생성된 SALT로 패스워드 해시 생성
    bcrypt.hash(room.password, salt, function(err, hash) {
      if (err) return next(err);

      room.password = hash;
      next();
    });
  });
});

RoomSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

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
