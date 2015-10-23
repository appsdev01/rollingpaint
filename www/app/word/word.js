angular.module('word', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('word', {
        url: '/word/:roomId/user/:userId/seq/:seqId',
        templateUrl: "app/word/word.html",
        controller: 'WordCtrl'
      });
  })

.controller('WordCtrl', function($scope, $stateParams, $http, $ionicModal) {

  $scope.roomId = $stateParams.roomId;
  $scope.userId = $stateParams.userId;

  // '/wordList/:roomNo/users/:userId'
  console.log("response : " + $stateParams.roomId);
  $http.get('/api/words/wordList/' + $stateParams.roomId + '/seq/' + $stateParams.seqId).then(function(response) {
    console.log("response : " + response);
    console.log("response.data : " + response.data);
    console.log("response.data[0].value : " + response.data[0][0].value);

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
      url: '/api/sketchbooks/' + $scope.userId + '/paper',
      data: {
        "word": word,
        "ownerId": $scope.userId,
        "type" : 'word'
      }
    }).success(function(response) {
      if (response) {
        $scope.resultWord = response.word;
        console.log('Create a sketchbook Success !!!');
      }
    });
  };
});
