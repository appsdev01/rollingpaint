var mongoose = require('mongoose');
var ShortId = require('mongoose-minid');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var PlayerSchema = new Schema({
  userId: ShortId,
  username: String,
  playStatus: String,
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

// playStatus 상태 코드
// 01: 게임 대기
// 02: 게임 준비 (방장은 입장 후 바로 준비 완료 상태)
// 03: 단어 선택
// 04: 그림 그리기
// 05: 단어 맞추기
// 06: 점수 주기
// 10: 연결 끊김

if (!PlayerSchema.options.toJSON) {
  PlayerSchema.options.toJSON = {};
}
PlayerSchema.options.toJSON.transform = function(doc, ret, options) {
  delete ret._id;
};

var RoomSchema = new Schema({
  _id: ShortId,
  title: String,
  password: String, // null default
  capacity: Number,
  ownerId: String,
  status: String, // 01: opened(default), 02: playing, 03: ended
  wordseed: String, // random value
  gameround: Number, // 1(default)
  players: [PlayerSchema], // owner(default)
  sketchbooks: [ShortId], // status(02) > game
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
});

RoomSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  var room = this;

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
  ret.isSecret = !!ret.password;
  delete ret.password; // Client에게 노출하지 않음
};

var Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
