angular.module('home', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: "app/home/home.html",
        controller: 'HomeCtrl'
      });
  })
  .controller('HomeCtrl', function($scope, $http) {

    $scope.loginData = {};

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

    $http.get('/pictures').then(function(response) {
      console.log(response);
      $scope.pictures = response.data;
    });

  });
