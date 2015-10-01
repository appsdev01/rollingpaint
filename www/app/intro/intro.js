angular.module('intro', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('intro', {
        url: '/intro',
        templateUrl: "app/intro/intro.html",
        controller: 'IntroCtrl'
      });
  })
  .controller('IntroCtrl', function($scope, $http) {

    $scope.loginData = {};
    
  });
