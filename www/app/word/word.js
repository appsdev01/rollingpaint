angular.module('word', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('word', {
        url: '/word',
        templateUrl: "app/word/word.html",
        controller: 'WordCtrl',
        params: {
          roomId: null,
          seqId: null,
          playerId: null,
          nextPlayerId: null,
          sketchbookId: null
        }
      });
  })

.controller('WordCtrl', function($scope, $interval, $ionicPopup, $ionicBackdrop, $timeout, $stateParams, $http, $ionicModal) {
  $scope.roomId = $stateParams.roomId;
  $scope.userId = $stateParams.playerId;
  $scope.nextPlayerId = $stateParams.nextPlayerId;
  $scope.sketchbookId = $stateParams.sketchbookId;
  $scope.seqId = $stateParams.seqId;

  //단어선택 시간 카운트
  $scope.timeCount = 8;
  $interval(function() {
    $scope.timeCount--;
    if ($scope.timeCount === 0) {
      $ionicBackdrop.retain();
      var alertPopup = $ionicPopup.alert({
        title: '시간 종료',
        subTitle: '다음 단계로 이동합니다',
      });
      $timeout(function() {
        //게임 다음 단계 페이지 호출!
        $scope.goSketchbook();
        $ionicBackdrop.release();
        alertPopup.close();
        window.location.href = '#/sketch/' + $scope.sketchbookId + '/roomId/' + $scope.roomId + '/userId/' + $scope.userId + '/seqId/' + $scope.seqId;
      }, 1000);
    }
  }, 1000, $scope.timeCount);

  // '/wordList/:roomNo/users/:userId'
  console.log("roomId : " + $stateParams.roomId);
  console.log("sketchbookId : " + $stateParams.sketchbookId);

  $http.get('/api/words/wordList/' + $stateParams.roomId + '/seq/' + $stateParams.seqId).then(function(response) {
    $scope.words = response.data;

    // 스케치북으로 이동
    $scope.goSketchbook = function(word) {
      // 시간 내 선택 못 했을 경우, 첫번째 단어세팅
      if(word === undefined) word = $scope.words[0][0].value;
      $http.put('/api/sketchbooks/' + $scope.sketchbookId, {
        word: word
      }).then(function(response) {
        console.log(response.data);
      });

      // 03: 단어 선택
      $http.put('/api/rooms/' + $stateParams.roomId + '/users/' + $scope.userId, {
        status: '03'
      }).then(function(response) {
        console.log(response.data);
        //$scope.room = response.data;
      });
    };
  });



});
