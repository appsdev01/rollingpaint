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
  $scope.sketchbookId = $stateParams.sketchbookId;

  // '/wordList/:roomNo/users/:userId'
  console.log("roomId : " + $stateParams.roomId);
  console.log("sketchbookId : " + $stateParams.sketchbookId);

  $http.get('/api/words/wordList/' + $stateParams.roomId + '/seq/' + $stateParams.seqId).then(function(response) {
    $scope.words = response.data;
  });



  // 턴 지정하기
  // POST /sketchbook/1/paper/1/
  $scope.createSketchbook = function(word) {
    $scope.resultWord = "";
    //console.log('Doing login', $scope.loginData);
    console.log('word : ', word);

    $http({
      method: 'POST',
      url: '/api/sketchbooks/' + $scope.sketchbookId + '/paper',
      data: {
        "sketchbookId":$scope.sketchbookId,
        "word": word,
        "ownerId": $scope.userId,
        "type" : 'word'
      }
    }).success(function(response) {
      if (response) {
        $scope.resultWord = response.word;
        console.log('Create a sketchbook Success !!!');
        //window.location.href = '#/';
      }
    });
  };
});
