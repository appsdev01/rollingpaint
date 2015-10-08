angular.module('picture', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('picturemenu', {
        url: "/picture",
        abstract: true,
        templateUrl: "app/picture/picture-menu.html"
      })
      .state('picturemenu.home', {
        url: '/home',
        views: {
          'menuContent': {
              templateUrl: "app/picture/picture.html",
              controller: 'PictureCtrl'
          }
        }
      });
  })
  .controller('PictureCtrl', function($scope, $http) {

    $http.get('/api/pictures').then(function(response) {
      console.log(response);
      $scope.pictures = response.data;
    });

  });
