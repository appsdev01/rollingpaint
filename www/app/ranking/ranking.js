angular.module('ranking', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('ranking', {
        url: '/ranking',
        templateUrl: "app/ranking/ranking.html",
        controller: 'RankingCtrl'
      });
  })

.controller('RankingCtrl', function($scope, $ionicModal) {
      console.log("hello");
      $scope.userlists = [
      { rank: 1, name: 'Berry', popularityscore: 100, gamescore: 3 },
      { rank: 2, name: 'Chansu', popularityscore: 70, gamescore: 5 },
      { rank: 3, name: 'Billy', popularityscore:   0, gamescore: 2 },
      { rank: 4, name: 'Chansu', popularityscore: 70, gamescore: 5 },
      { rank: 5, name: 'Billy', popularityscore:   0, gamescore: 2 },
      { rank: 6, name: 'Chansu', popularityscore: 70, gamescore: 5 }
    ];
});
