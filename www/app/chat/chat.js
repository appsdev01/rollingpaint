angular.module('chat', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: "app/chat/chat.html",
        controller: 'ChatCtrl'
      });
  })
  .controller('ChatCtrl', function($scope, $http, socket, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {

    $scope.data = {
      messages: ['Hello', 'World', 'Nice to meet you!'],
      message: ''
    };

    // 메시지를 서버로 보냄
    $scope.sendMessage = function() {
      if ($scope.data.message === '') {
        return;
      }
      console.log('emitting message : ' + $scope.data.message);
      socket.emit('chat message', $scope.data.message);
      $scope.data.message = '';
    };

    // 서버로부터 받은 메시지를 추가
    socket.on('chat message', function(msg) {
      console.log('receiving message : ' + msg);
      $scope.data.messages.push(msg);
    });

    /*
        var messageOptions = [{content : '<p> Hello </p>'}];

        $scope.messages = messageOptions.slice(0, messageOptions.length);
        $scope.input_message = { content: '', self: true };

        $scope.send = function() {
          var sendMessage = { content: '<p>' + $scope.input_message.content + '</p>', self: true };
          console.log(sendMessage.content);

          var socket = io();
          $scope.messages.push(angular.extend({}, sendMessage));

          //	socket.emit('chat message', msg);
          socket.emit('fromClient', {msg : $scope.messages});
          socket.on('toClient', function(data) {
            console.dir(data);
            console.log('data.msg = ' + data.msg);

            $('#chat-content').append($('<li>').text(data.msg));
          });
    */
    /*
    socket.emit('chat message', $scope.messages);
    socket.on('chat message', function(msg) {
      $('#chat-content').append($('<li>').text(msg));
    });
    */
    // $scope.input_message.content = '';

    // Update the scroll area and tell the frosted glass to redraw itself
    $ionicFrostedDelegate.update();
    $ionicScrollDelegate.scrollBottom(true);

  });

/*
socket.on('chat message', function(msg) {
//  $scope.messages.push(angular.extend({}, sendMessage));
  $('#chat-content').append($('<li>').text(msg));
});

*/
