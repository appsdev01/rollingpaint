angular.module('word', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('word', {
        url: '/word/:roomId/user/:userId/seq/:seqId/sketchbook/:sketchbookId',
        templateUrl: "app/word/word.html",
        controller: 'WordCtrl'
      });
  })

.controller('WordCtrl', function($scope, $stateParams, $http, $ionicModal) {

  $scope.roomId = $stateParams.roomId;
  $scope.userId = $stateParams.userId;
  $scope.seqId = $stateParams.seqId;
  $scope.sketchbookId = $stateParams.sketchbookId;

  // '/wordList/:roomNo/users/:userId'
  console.log("roomId : " + $stateParams.roomId);
  console.log("sketchbookId : " + $stateParams.sketchbookId);

  $http.get('/api/words/wordList/' + $stateParams.roomId + '/seq/' + $stateParams.seqId).then(function(response) {
    $scope.words = response.data;
  });

  // 스케치북으로 이동
  $scope.goSketchbook = function(word) {
    // 03: 단어 선택
    $http.put('/api/rooms/' + $stateParams.roomId + '/users/' + $scope.userId, {
      status: '03'
    }).then(function(response) {
      console.log(response.data);
      //$scope.room = response.data;
    });

    window.location.href = '#/sketch/' + $scope.sketchbookId + '/roomId/' + $scope.roomId + '/userId/' + $scope.userId + '/seqId/' + $scope.seqId;
  };

  // 턴 지정하기
  // POST /sketchbook/1/paper/1/
  $scope.createSketchbook = function(word) {

    $http({
      method: 'POST',
      url: '/api/sketchbooks/' + $scope.sketchbookId + '/paper',
      data: {
        "sketchbookId": $scope.sketchbookId,
        "word": word,
        "ownerId": $scope.userId,
        "type": 'word'
      }
    }).success(function(response) {
      if (response) {
        console.log('Create a sketchbook Paper Success !!!');
        window.location.href = '#/sketch/' + $scope.sketchbookId;
      }
    });
  };
});
