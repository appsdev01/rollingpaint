module.exports = function(app, server) {
  var io = require('socket.io')(server);

  var chatSocket = io.of('/chat').on('connection', function(socket) {
    console.log('Connected from ' + socket.id);

    socket.on('disconnect', function() {
      console.log('Disconnected from ' + socket.id);
    });

    socket.on('room:join', function(msg) {
      console.log(msg);
      // msg = { "userId": "", "roomId": "" }

      // 방 ID로 socket room 참가
      socket.join(msg.roomId);
      // 특정 방의 참가자에게 새로운 참가자 정보 브로드캐스팅
      socket.broadcast.to(msg.roomId).emit('room:joined', msg);
    });

    socket.on('room:leave', function(msg) {
      console.log(msg);
      // msg = { "userId": "", "roomId": "" }

      // 방 ID로 socket room 참가
      socket.leave(msg.roomId);
      // 특정 방의 참가자에게 새로운 참가자 정보 브로드캐스팅
      socket.broadcast.to(msg.roomId).emit('room:left', msg);
    });

    socket.on('room:message', function(msg) {
      console.log(msg);
      // msg = { "userId": "", "roomId": "", "content": "" }

      var returnMsg = {
        userId: msg.userId,
        content: msg.content
      };

      console.log(msg.roomId);
      console.log(returnMsg);

      // 특정 방의 참가자에게 메시지 브로드캐스팅
      io.of('/chat').in(msg.roomId).emit('room:message', returnMsg);
    });

  });

};
