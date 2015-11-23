var Room = require('../models/room.server.model');
var _ = require('underscore') ;

module.exports = function(app, server) {
  var io = require('socket.io')(server);

  var sockets = {};

  var chatSocket = io.of('/chat').on('connection', function(socket) {
    console.log('Connected from ' + socket.id);
    sockets[socket.id] = {};

    socket.on('disconnect', function() {
      console.log('Disconnected from ' + socket.id);

      // 연결이 끊긴 경우 방에서 내보내고 방 참가자들에게 통보
      if (sockets[socket.id]) {
        Room.update({
          _id: sockets[socket.id].roomId
        }, {
          $pull: {
            players: {
              userId: sockets[socket.id].userId
            }
          }
        }, function(err, result) {

        });

        socket.broadcast.to(sockets[socket.id].roomId).emit('room:lost', sockets[socket.id]);

        delete sockets[socket.id];
      }

    });

    socket.on('room:join', function(msg) {

      // msg = { "userId": "", "roomId": "" }
      sockets[socket.id] = msg;

      // 방 ID로 socket room 참가
      socket.join(msg.roomId);
      // 특정 방의 참가자에게 새로운 참가자 정보 브로드캐스팅
      socket.broadcast.to(msg.roomId).emit('room:joined', msg);
    });

    socket.on('room:leave', function(msg) {
      console.log(msg);
      // msg = { "userId": "", "roomId": "" }

      delete sockets[socket.id];

      // 방 ID로 socket room 참가
      socket.leave(msg.roomId);
      // 특정 방의 참가자에게 새로운 참가자 정보 브로드캐스팅
      socket.broadcast.to(msg.roomId).emit('room:left', msg);
    });

    socket.on('room:message', function(msg) {
      // 특정 방의 참가자에게 메시지 브로드캐스팅
      io.of('/chat').in(msg.roomId).emit('room:message', {
        userId: msg.userId,
        content: msg.content
      });
    });

    socket.on('room:ready', function(msg) {
      io.of('/chat').in(msg.roomId).emit('room:ready');
    });

    socket.on('game:start', function(msg) {
      console.log('# game:start');
      console.log(msg);
      io.of('/chat').in(msg.room.id).emit('game:start', msg);
    });

    socket.on('room:sendReadyMessage', function(msg) {
      console.log(msg);
      // msg = { "userId": "", "roomId": "", "content": "" }

      var returnMsg = {
        userId: msg.userId,
        content: msg.content
      };

      console.log(msg.roomId);
      console.log(returnMsg);

      // 특정 방의 참가자에게 메시지 브로드캐스팅
      io.of('/chat').in(msg.roomId).emit('room:sendReadyMessage', returnMsg);
    });

    socket.on('room:sendStartMessage', function(msg) {
      var returnMsg = {
        userId: msg.userId,
        content: msg.content
      };

      console.log(msg.roomId);
      console.log(returnMsg);

      // 특정 방의 참가자에게 메시지 브로드캐스팅
      io.of('/chat').in(msg.roomId).emit('room:sendStartMessage', returnMsg);
    });

    socket.on('room:changeDisplay', function(msg) {

      console.log("changeDisplay!!!!!!!!!!!");
      var returnMsg = {
        userId: msg.userId,
        roomId: msg.roomId,
        url: msg.url
      };

      console.log(returnMsg);

      // 특정 방의 참가자에게 메시지 브로드캐스팅
      io.of('/chat').in(msg.roomId).emit('room:changeDisplay', returnMsg);
    });

    socket.on('word:ready', function(msg) {
      Room.findById(msg.roomId, function(err, doc) {
        if (err || !doc) {
          return;
        }

        var room = doc.toJSON();
        console.log(room);

        var allReady = !room.players.some(player => player.playStatus != '03');
        console.log('room ' + room.id + ' is all ready? '+ allReady);
        if (allReady) {
          // 참가자 전원 단어 선택이 완료된 경우
          io.of('/chat').in(room.id).emit('word:done', room);
        }
      });
    });

  });

};
