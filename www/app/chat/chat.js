angular.module('chat', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: "app/chat/chat.html",
        controller: 'ChatCtrl'
      });
  })
  .controller('ChatCtrl', function($scope, $http, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {

    var messageOptions = [{content : '<p> Hello </p>'}];

    $scope.messages = messageOptions.slice(0, messageOptions.length);
    $scope.input_message = { content: '', self: true };

    $scope.send = function() {
      var sendMessage = { content: '<p>' + $scope.input_message.content + '</p>', self: true };
      console.log(sendMessage.content);

      var socket = io.connect('http://localhost');
      console.log(socket);

      $scope.messages.push(angular.extend({}, sendMessage));

      //	socket.emit('chat message', msg);
      socket.emit('fromClient', {msg : $scope.messages});
      socket.on('toClient', function(data) {
        console.log('data = ' + data);
        console.log('data.msg = ' + data.msg);

        $('#chat-content').append($('<li>').text(data.msg));
      });
      /*
      socket.emit('chat message', $scope.messages);
      socket.on('chat message', function(msg) {
        $('#chat-content').append($('<li>').text(msg));
      });
      */
      $scope.input_message.content = '';

      // Update the scroll area and tell the frosted glass to redraw itself
      $ionicFrostedDelegate.update();
      $ionicScrollDelegate.scrollBottom(true);
    };
  });

/*
socket.on('chat message', function(msg) {
//  $scope.messages.push(angular.extend({}, sendMessage));
  $('#chat-content').append($('<li>').text(msg));
});

*/
