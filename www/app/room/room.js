angular.module('room', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/room/:roomId',
        templateUrl: "app/room/room.html",
        controller: 'RoomCtrl'
      });
  })
  .controller('RoomCtrl', function($scope, $state, $stateParams, $http, $q, chatSocket, $ionicFrostedDelegate, $ionicScrollDelegate, $ionicHistory, $rootScope) {
    $scope.room = {};
    $scope.user = {};
    $scope.players = {};
    $scope.sketchbooks = {};

    chatSocket.connect();

    // 접속자 정보 조회
    $http.get('/api/users/me').then(function(response) {
      $scope.user = response.data;
      // 방 정보 조회 후 참가 이벤트 소켓으로 전달
      $rootScope.me = response.data;
      chatSocket.emit('room:join', {
        userId: $scope.user.id,
        roomId: $stateParams.roomId
      });
    });

    function updateRoomInfo() {
      // 놀이방 정보 조회
      $http.get('/api/rooms/' + $stateParams.roomId).then(function(response) {
        console.log(response.data);

        var isparticipant = false;
        angular.forEach(response.data.players, function(player) {
          if (player.userId === $scope.user.id)
            isparticipant = true;
        });

        // if (!isparticipant) {
        //   window.location.href = '#/lobby';
        //   return;
        // }

        $scope.room = response.data;
        $scope.room.status = '02';

        // 방 참가자 정보 조회
        var i = 1;
        angular.forEach($scope.room.players, function(player) {
          if (player.playStatus === '01') $scope.room.status = '01'; // 한 명이라도 ready 상태가 아니면 '01'
          $http.get('/api/users/' + player.userId).then(function(response) {
            $scope.players[response.data.id] = response.data;
            $scope.players[response.data.id].playStatus = player.playStatus;
            $scope.players[response.data.id].seq = i++;
          });
        });

        $http.put('/api/rooms/' + $stateParams.roomId, {
          status: $scope.room.status
        }).then(function(response) {
          console.log(response.data);
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
        userId: $scope.user.id,
        roomId: $scope.room.id,
        content: $scope.data.message
      });
      $scope.data.message = '';
    };

    // 준비상태 토클
    $scope.toggleReady = function() {
      var isReady = $scope.players[$scope.user.id].playStatus === '02';
      var status = isReady ? '01' : '02';

      // 준비 상태 저장
      $http.put('/api/rooms/' + $stateParams.roomId + '/users/' + $scope.user.id, {
        status: status
      }).then(function(response) {
        // 준비 상태 저장이 정상적으로 완료되면

        // 서버 소켓으로 플레이 상태 변경 메시지 전달
        chatSocket.emit('room:message', {
          roomId: $scope.room.id,
          content: isReady ? $scope.user.username + '님이 준비를 취소하였습니다.' : $scope.user.username + '님이 준비되었습니다.'
        });

        // 서버 소켓으로 플레이 상태 변경 업데이트 전달
        chatSocket.emit('room:ready', {
          roomId: $scope.room.id
        });
      });
    };

    // [Server -> Client] 참가자 준비 상태 변경 이벤트
    chatSocket.on('room:ready', function(msg) {
      updateRoomInfo();
    });

    // 게임 시작 버튼에 연결
    $scope.startGame = function() {
      // [Client -> Server] 게임 시작 메시지
      chatSocket.emit('room:message', {
        roomId: $scope.room.id,
        content: '게임을 시작합니다.'
      });

      // 플레이어 수만큼 스케치북 생성 요청
      var promises = $scope.room.players.map(function(player) {
        console.log(player);
        return $http.post('/api/sketchbooks', {
          roomId: $scope.room.id,
          userId: player.userId
        });
      });

      $q.all(promises).then(function() {
        // 모든 스케치북이 생성 완료된 시점

        // 스케치북이 추가된 새로운 방 정보를 업데이트
        $http.get('/api/rooms/' + $scope.room.id).then(function success(response) {
          // 서버 소켓으로 게임 시작 이벤트 전송
          chatSocket.emit('game:start', {
            room: response.data
          });
        });
      });

      // 참가자 수만큼 스케치북 생성
      // angular.forEach($scope.room.players, function(player) {
      //   $http.post('/api/sketchbooks', {
      //     roomId: $scope.room.id,
      //     userId: player.userId
      //   }).then(function(response) {
      //     sketchbookId = response.data;
      //
      //     var playerSeq = $scope.players[player.userId].seq;
      //     var totalPlayers = $scope.room.players.length;
      //     chatSocket.emit('room:start', {
      //       roomId: $scope.room.id,
      //       seqId: playerSeq,
      //       playerId: player.userId,
      //       nextPlayerId: $scope.room.players[(playerSeq + 1) % totalPlayers].userId,
      //       sketchbookId: sketchbookId
      //     });
      //   });
      // });
    };

    // [Server -> Client] 게임 시작 이벤트
    chatSocket.on('game:start', function(msg) {
      console.log('Game Start ');
      console.log(msg);
      $ionicHistory.clearCache().then(function(){
        $state.go('word', msg);
      });
    });

    // 서버로 메시지 전송
    // $scope.sendStatusMessage = function() {
    //
    //   var sketchbookId = "";
    //   if ($scope.user.id === $scope.room.ownerId) {
    //     chatSocket.emit('room:sendStartMessage', {
    //       userId: '',
    //       roomId: $scope.room.id,
    //       content: '게임 시작합니다!!!'
    //     });
    //
    //     // 인원 수만큼 스케치북 생성
    //     angular.forEach($scope.room.players, function(user) {
    //       console.log(user.username + "의 스케치북 생성!!!!!!!!!!!!!");
    //       $http.post('/api/sketchbooks', {
    //         roomId: $scope.room.id,
    //         userId: user.userId
    //       }).then(function(response) {
    //         sketchbookId = response.data;
    //         $scope.sketchbooks[$scope.players[user.userId].seq - 1] = sketchbookId;
    //         var url = '#/word/' + $scope.room.id + '/user/' + user.userId + '/seq/' + $scope.players[user.userId].seq + '/sketchbook/' + sketchbookId;
    //         chatSocket.emit('room:changeDisplay', {
    //           userId: user.userId,
    //           roomId: $scope.room.id,
    //           url: url
    //         });
    //       });
    //     });
    //
    //   } else {
    //     var readyStatus = $scope.players[$scope.user.id].playStatus === '01' ? '02' : '01';
    //     $http.put('/api/rooms/' + $stateParams.roomId + '/users/' + $scope.user.id, {
    //       status: readyStatus
    //     }).then(function(response) {
    //       console.log(response.data);
    //       //$scope.room = response.data;
    //     });
    //
    //     chatSocket.emit('room:sendReadyMessage', {
    //       userId: '',
    //       roomId: $scope.room.id,
    //       content: (readyStatus === '02' ? $scope.players[$scope.user.id].username + '님이 준비가 됐습니다.' : $scope.players[$scope.user.id].username + '님이 준비를 취소하였습니다.')
    //     });
    //     //updateRoomInfo();
    //   }
    // };

    // 방에서 나가기
    $scope.leaveRoom = function(room) {
      console.log('leave room!');

      // 플레이어가 한 명인 경우 나가기와 동시에 방 삭제
      if (room.players.length == 1) {
        $http.delete('api/rooms/' + room.id).then(function(response) {
          console.log(response.data);
          console.log('Room is deleted!');
        });
      }

      //플레이어가 두 명 이상인 경우 방장 위임하기 (break 기능 필요)
      if (room.players.length > 1) {
        var newOwnerId = "";

        angular.forEach(room.players, function(player) {
          // console.log("newOwnerId : " + newOwnerId);
          // console.log("랜덤으로 선택된 플레이어 : " + player.userId);
          // console.log("방장 : " + room.ownerId);
          // console.log("로그인한 유저 : " + $scope.user.id);

          // 방장이 퇴장하려 할 때, 다른 플레이어로 새로운 방장 지정
          if (newOwnerId === "" && $scope.user.id === room.ownerId && room.ownerId !== player.userId) {
            newOwnerId = player.userId;
            //console.log("changed newOwnerId : " + newOwnerId);
            $http.post('api/rooms/' + room.id + '/owner', {
              userId: newOwnerId
            }).then(function(response) {
              console.log(response);
              console.log('OwnerId is changed');
            });
          }
        });
      }

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
      updateRoomInfo();
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
      $http.get('/api/users/' + msg.userId).then(function(response) {
        $scope.players[response.data.id] = response.data;
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
      console.log($scope.players);
      $scope.data.messages.push({
        userId: '',
        content: $scope.players[msg.userId].username + '님이 퇴장하셨습니다.'
      });

      updateRoomInfo();
      $ionicScrollDelegate.$getByHandle('messages-scroll').scrollBottom(true);
    });

    // 사용자 연결 끊김 이벤트
    chatSocket.on('room:lost', function(msg) {
      console.log(msg);
      console.log($scope.players);
      $scope.data.messages.push({
        userId: '',
        content: $scope.players[msg.userId].username + '님의 연결이 끊겼습니다.'
      });
      updateRoomInfo();
      $ionicScrollDelegate.$getByHandle('messages-scroll').scrollBottom(true);
    });

    // 게임시작 후, 사용자별 화면 전환
    chatSocket.on('room:changeDisplay', function(msg) {
      console.log(msg);
      if (msg.userId === $scope.user.id) {
        window.location.href = msg.url;
      }
      $ionicScrollDelegate.$getByHandle('messages-scroll').scrollBottom(true);
    });

    $scope.$on('$destroy', function() {
      console.log('RoomCtrl destroy');

      // $http.delete('/api/rooms/' + $scope.room.id + '/users/' + $scope.user.id)
      //   .then(function(response) {
      //     // DB 업데이트 완료 후 소켓 room 퇴장
      //     chatSocket.emit('room:leave', {
      //       userId: $scope.user.id,
      //       roomId: $scope.room.id
      //     });
      //
      //     chatSocket.disconnect();
      //   });
    });

    // Update the scroll area and tell the frosted glass to redraw itself
    $ionicFrostedDelegate.update();
    $ionicScrollDelegate.scrollBottom(true);
  });
