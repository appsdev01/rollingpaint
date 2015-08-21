angular.module('register', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: "app/register/register.html",
        controller: 'RegisterCtrl'
      });
  })
  .controller('RegisterCtrl', function($scope, $http) {

    $scope.signUpData = {};

    $http.get('/pictures').then(function(response) {
      console.log(response);
      $scope.pictures = response.data;
    });

  });
