angular.module('ranking', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('ranking', {
        url: '/ranking',
        templateUrl: "app/ranking/ranking.html",
        controller: 'RankingCtrl'
      });
  })

.controller('RankingCtrl', function($scope, $ionicModal, $http) {

  $http.get('/scores/102').then(function(response) {
    $scope.userlists = response.data;
  });
});
