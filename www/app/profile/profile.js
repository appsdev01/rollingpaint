angular.module('profile', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: "app/profile/profile.html",
        controller: 'ProfileCtrl'
      });
  })
  .controller('ProfileCtrl', function($scope, $http) {
    // get my profile
    $http.get('/users/me').then(function(response) {
      $scope.user = response.data;
    });
  });
