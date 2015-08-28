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

/*
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      $http({
        method: 'POST',
        url: 'login',
        data: {
          "email": $scope.loginData.email,
          "password": $scope.loginData.password
        }
      }).success(function(response) {
        if (response) {}
      });
    };
*/
  });
