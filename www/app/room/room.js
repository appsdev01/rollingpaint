angular.module('room', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('room', {
        cache: false,
        url: '/room/:roomId',
        templateUrl: "app/room/room.html",
        controller: 'RoomCtrl'
      });
  })
  .controller('RoomCtrl', function($scope, $stateParams, $http, chatSocket, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {
    console.log('start RoomCtrl');
    $scope.room = {};
    $scope.user = {};
    $scope.users = {};

    // 접속자 정보 조회
    $http.get('/users/me').then(function(response) {
      $scope.user = response.data;
    });

    function updateRoomInfo() {
      // 놀이방 정보 조회
      $http.get('/api/rooms/' + $stateParams.roomId).then(function(response) {
        console.log(response.data);
        $scope.room = response.data;

        // 방 참가자 정보 조회
        angular.forEach($scope.room.users, function(user) {
          $http.get('/users/' + user).then(function(response) {
            $scope.users[response.data._id] = response.data;
          });
        });
      });
    }

    updateRoomInfo();

    $scope.data = {
      messages: [{
        userId: '',
        content: 'Welcome!'
      }],
      message: ''
    };

    // 서버로 메시지 전송
    $scope.sendMessage = function() {
      if ($scope.data.message === '') {
        return;
      }

      chatSocket.emit('room:message', {
        userId: $scope.user._id,
        roomId: $scope.room.id,
        content: $scope.data.message
      });
      $scope.data.message = '';
    };

    // 서버로 메시지 전송
    $scope.sendStatusMessage = function() {

      if($scope.user._id === $scope.room.ownerId){
        chatSocket.emit('room:sendStartMessage', {
          userId: '',
          roomId: $scope.room.id,
          content: '게임 시작합니다!!!'
        });
      }else{

        $http.put('/api/rooms/' + $stateParams.roomId + '/users/' + $scope.user._id).then(function(response) {
          console.log(response.data);
          //$scope.room = response.data;
        });

        chatSocket.emit('room:sendReadyMessage', {
          userId: '',
          roomId: $scope.room.id,
          content: $scope.user._id + '가 준비가 됐습니다.'
        });
        updateRoomInfo();
      }
    };

    // 방에서 나가기
    $scope.leaveRoom = function() {
      console.log('leave room!');
      window.location.href = '#/lobby';
    };

    // 서버로부터 받은 메시지를 추가
    chatSocket.on('room:message', function(msg) {
      console.log(msg);
      $scope.data.messages.push(msg);
      $ionicScrollDelegate.$getByHandle('messages-scroll').scrollBottom(true);
    });

    // 서버로부터 받은 메시지를 추가
    chatSocket.on('room:sendReadyMessage', function(msg) {
      console.log(msg);
      $scope.data.messages.push(msg);
      $ionicScrollDelegate.$getByHandle('messages-scroll').scrollBottom(true);
    });

    // 서버로부터 받은 메시지를 추가
    chatSocket.on('room:sendStartMessage', function(msg) {
      console.log(msg);
      $scope.data.messages.push(msg);
      $ionicScrollDelegate.$getByHandle('messages-scroll').scrollBottom(true);
    });

    // 새로운 참가자 이벤트
    chatSocket.on('room:joined', function(msg) {
      updateRoomInfo();

      // 새로운 참가자 정보 조회
      $http.get('/users/' + msg.userId).then(function(response) {
        $scope.users[response.data._id] = response.data;
        $scope.data.messages.push({
          userId: '',
          content: response.data.username + '님이 참가하셨습니다.'
        });
        $ionicScrollDelegate.$getByHandle('messages-scroll').scrollBottom(true);
      });
    });

    // 사용자 퇴장 이벤트
    chatSocket.on('room:left', function(msg) {
      console.log(msg);
      console.log($scope.users);
      $scope.data.messages.push({
        userId: '',
        content: $scope.users[msg.userId].username + '님이 퇴장하셨습니다.'
      });
      updateRoomInfo();
      $ionicScrollDelegate.$getByHandle('messages-scroll').scrollBottom(true);
    });

    $scope.$on('$destroy', function() {
      console.log('RoomCtrl destroy');

      $http.delete('/api/rooms/' + $scope.room.id + '/users/' + $scope.user._id)
        .then(function(response) {
          // DB 업데이트 완료 후 소켓 room 퇴장
          chatSocket.emit('room:leave', {
            userId: $scope.user._id,
            roomId: $scope.room.id
          });
        });
    });

    // Update the scroll area and tell the frosted glass to redraw itself
    $ionicFrostedDelegate.update();
    $ionicScrollDelegate.scrollBottom(true);
  });
