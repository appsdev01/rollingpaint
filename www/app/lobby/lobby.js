angular.module('lobby', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('lobby', {
        url: '/lobby',
        templateUrl: "app/lobby/lobby.html",
        controller: 'LobbyCtrl'
      });
  })
  .controller('LobbyCtrl', function($scope, $http, $ionicModal, chatSocket) {

    // $http.get('/rooms').then(function(response) {
    //   console.log("maybe no response");
    //   console.log(response);
    //   $scope.rooms = response.data;
    // });

    // get my profile
    $http.get('/users/me').then(function(response) {
      $scope.user = response.data;
    });

    $http.get('/api/rooms').then(function(response) {
      $scope.rooms = response.data;
    });

    $scope.roomData = {};

    $scope.listRooms = function() {
      $http.get('/api/rooms').then(function(response) {
        $scope.rooms = response.data;
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.joinRoom = function(room) {
      // password 입력 후 기존 방의 password와 다르면 튕기도록 처리
      console.log('join room!');
      console.log(room);

      $http.post('/api/rooms/' + room.id + '/users', {
          userId: $scope.user._id,
          username: $scope.user.username,
          password: room.password
        })
        .then(function(response) {
          // DB 업데이트 완료 후 소켓 room 참가
          chatSocket.emit('room:join', {
            userId: $scope.user._id,
            roomId: room.id
          });

          window.location.href = '#/room/' + room.id;
        }, function(response) {
          console.log('방 참가 실패');
          console.log(response);
        });

      $scope.closePasswordModal();
    };

    // Perform the login action when the user submits the login form
    $scope.createRoom = function(req, res) {

      $scope.roomData.titleAlert = false;
      $scope.roomData.passwordAlert = false;
      $scope.roomData.capacityAlert = false;
      // 유효성 체크 필요 (Title, capacity 미설정 시 또는 Password 체크 후 값 미입력 시)
      if ($scope.roomData.title === undefined || $scope.roomData.title === "") {
        $scope.roomData.titleAlert = true;
        return;
      } else if ($scope.roomData.lock && ($scope.roomData.password === undefined || $scope.roomData.password === "")) {
        $scope.roomData.passwordAlert = true;
        return;
      } else if ($scope.roomData.capacity === undefined) {
        $scope.roomData.capacityAlert = true;
        return;
      }

      $http({
        method: 'POST',
        url: '/api/rooms',
        data: {
          "title": $scope.roomData.title,
          "password": $scope.roomData.password,
          "capacity": parseInt($scope.roomData.capacity),
          "ownerId": $scope.user._id,
          "wordseed": Math.floor(Math.random() * 1000) + 1,
          "users": [{
            userId: $scope.user._id,
            username: $scope.user.username
          }]
        }
      }).success(function(response) {
        if (response) {
          // DB 업데이트 완료 후 소켓 room 참가
          chatSocket.emit('room:join', {
            userId: $scope.user._id,
            roomId: response.id
          });
          window.location.href = '#/room/' + response.id; // 방으로 들어가도록 고쳐야 함
          $scope.closeNewRoom();
        }
      });
    };

    // 방만들기 모달
    $ionicModal.fromTemplateUrl('app/lobby/newroom.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalNewRoom = modal;
    });

    $scope.openNewRoom = function() {
      $scope.roomData.titleAlert = false;
      $scope.roomData.passwordAlert = false;
      $scope.roomData.capacityAlert = false;
      $scope.modalNewRoom.show();
    };

    $scope.closeNewRoom = function() {
      $scope.modalNewRoom.hide();
    };

    // 비밀번호 입력 모달
    $ionicModal.fromTemplateUrl('app/lobby/password.modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalJoinRoom = modal;
    });

    $scope.openPasswordModal = function(room) {
      room.password = '';
      $scope.joiningRoom = room;
      $scope.modalJoinRoom.show();
    };

    $scope.closePasswordModal = function() {
      $scope.modalJoinRoom.hide();
    };

    // 컨트롤러 종료 시 모달 자원 해제
    $scope.$on('$destroy', function() {
      $scope.modalNewRoom.remove();
      $scope.modalJoinRoom.remove();
    });

  });
