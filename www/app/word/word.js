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
      $http.get('/words/wordList/3/users/sehee88').then(function(response) {
        console.log(response);
        $scope.words = response.data;
      });

      // 턴 지정하기
      // POST /sketchbook/1/paper/1/
      $scope.createSketchbook = function(word) {
        //console.log('Doing login', $scope.loginData);
        console.log('word : ', word);

        $http({
          method: 'POST',
          url: '/sketchbooks/sehee88/paper/10',
          data: {
            "word": word,
            "type" : "answer"
          }
        }).success(function(response) {
          if (response) {
            console.log('Create a sketchbook Success !!!');
          }
        });
      };
});
