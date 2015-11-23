angular.module('word', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('word', {
        url: '/word',
        templateUrl: "app/word/word.html",
        controller: 'WordCtrl',
        params: {
          room: ''
        }
      });
  })
  .controller('WordCtrl', function($scope, $interval, $ionicPopup, $ionicBackdrop, $timeout, $stateParams, $http, $ionicModal, $rootScope, $q, $state, chatSocket) {
    var room = $stateParams.room;
    var player;
    angular.forEach(room.players, function(value, index) {
      if (value.userId === $rootScope.me.id) {
        player = value;
        player.seq = index + 1;
      }
    });
    var nextPlayer = room.players[(player.seq + 1 % room.players.length)];

    $scope.selectWord = function(value) {
      $scope.word = value;
    };

    // 임의의 단어 목록 얻기
    $http.get('/api/words/wordList/' + room.id + '/seq/' + player.seq).then(function(response) {
      $scope.words = response.data;
    });

    // 단어선택 시간 카운트
    $scope.timeCount = 10;

    $interval(function() {
      $scope.timeCount--;

      // 주어진 시간이 지나면 선택된 단어를 서버에 저장
      if ($scope.timeCount === 0) {

        // 그 시간동안 선택된 단어가 없다면 임의의 단어가 선택 됨
        if (!$scope.word) {
          $scope.word = $scope.words[0][0].value;
        }

        $ionicBackdrop.retain();

        $scope.alertPopup = $ionicPopup.alert({
          title: '단어선택 완료',
          subTitle: '다른 플레이어를 기다리고 있습니다.',
        });

        console.log('상태변경');
        $q.all([
          // 스케치북에 단어를 저장
          $http.put('/api/sketchbooks/' + player.sketchbook, {
            word: $scope.word
          }),
          // 플레이어 상태코드 변경
          $http.put('/api/rooms/' + room.id + '/users/' + player.userId, {
            status: '03'
          })
        ]).then(function(response) {
          console.log(response);
          // 모든 호출이 정상적인 경우
          $http.get('/api/rooms/' + room.id).then(function(response) {
            console.log(response);
          });

          chatSocket.emit('word:ready', {
            roomId: room.id
          });
        }, function(response) {
          console.log(response);
          // 단어 저장 또는 플레이어 상태코드 변경에 실패한 경우
          $ionicBackdrop.release();
          alertPopup.close();
        });
      }
    }, 1000, $scope.timeCount);

    chatSocket.on('word:done', function(msg) {
      $scope.alertPopup.close();
      $scope.delayCount = 3;

      var donePopup = $ionicPopup.show({
        title: '게임 시작',
        template: '모두 단어선택을 마쳤습니다.<br><h1>{{delayCount}}</h1>',
        scope: $scope
      });

      $interval(function() {
        $scope.delayCount--;
        if ($scope.delayCount === 0) {
          donePopup.close();
          $ionicBackdrop.release();
          $state.go('sketch', msg);
        }
      }, 1000);
    });

  });
