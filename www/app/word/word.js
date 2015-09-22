angular.module('word', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('word', {
        url: '/word',
        templateUrl: "app/word/word.html",
        controller: 'WordCtrl'
      });
  })

.controller('WordCtrl', function($scope, $http, $ionicModal) {
  // '/wordList/:roomNo/users/:userId'
  $http.get('/words/wordList/i7wllEt/users/4').then(function(response) {
    console.log("response : " + response);
    console.log("response.data : " + response.data);
    console.log("response.data[0] : " + response.data[0]);
    console.log("response.data[0].value : " + response.data[0].value);

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
      url: '/sketchbooks/sehee88/paper/10',
      data: {
        "word": word,
        "ownerId": "sehee88"
      }
    }).success(function(response) {
      if (response) {
        $scope.resultWord = response.word;
        console.log('Create a sketchbook Success !!!');
      }
    });
  };
});
