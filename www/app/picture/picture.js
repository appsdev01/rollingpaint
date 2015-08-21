angular.module('picture', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('picture', {
        url: '/picture',
        templateUrl: "app/picture/picture.html",
        controller: 'PictureCtrl'
      });
  })
  .controller('PictureCtrl', function($scope, $http) {

    $http.get('/pictures').then(function(response) {
      console.log(response);
      $scope.pictures = response.data;
    });

  });
