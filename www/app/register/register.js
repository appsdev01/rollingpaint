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

    $scope.doSignUp = function() {
      console.log('Doing sign up', $scope.signUpData);

      $http({
        method: 'POST',
        url: 'register',
        data: {
          "username": $scope.signUpData.username,
          "email": $scope.signUpData.email,
          "password": $scope.signUpData.password
        }
      }).success(function(response) {
          if (response) {
            window.location.href = '#/app/lobby';
          }
        }
      );
    };
  });
