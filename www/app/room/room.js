angular.module('room', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/room/:roomId',
        templateUrl: "app/room/room.html",
        controller: 'RoomCtrl'
      });
  })
  .controller('RoomCtrl', function($scope, $stateParams, $http, socket, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {
    $scope.room = {};
    $scope.user = {};
    $scope.users = {};

    $http.get('/api/rooms/' + $stateParams.roomId).then(function(response) {
      $scope.room = response.data;
      angular.forEach($scope.room.users, function(user) {
        $http.get('/users/' + user).then(function(response) {
          $scope.users[response.data._id] = response.data;
        });
      });
    });

    $http.get('/users/me').then(function(response) {
      $scope.user = response.data;
      socket.emit('room:join', {
        user: $scope.user._id
      });
    });

    $scope.data = {
      messages: [{
        user: '',
        content: 'Welcome!'
      }],
      message: ''
    };

    // 메시지를 서버로 보냄
    $scope.sendMessage = function() {
      if ($scope.data.message === '') {
        return;
      }
      socket.emit('chat message', {
        user: $scope.user._id,
        content: $scope.data.message
      });
      $scope.data.message = '';
    };

    // 서버로부터 받은 메시지를 추가
    socket.on('chat message', function(msg) {
      $scope.data.messages.push(msg);
    });

    socket.on('room:join', function(msg) {
      $http.get('/users/' + msg.user).then(function(response) {
        $scope.users[response.data._id] = response.data;
        $scope.data.messages.push({
          user: '',
          content: response.data.username + '님이 참가하셨습니다.'
        });
      });
    });

    // Update the scroll area and tell the frosted glass to redraw itself
    $ionicFrostedDelegate.update();
    $ionicScrollDelegate.scrollBottom(true);
  });
