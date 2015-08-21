angular.module('room', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/newroom',
        templateUrl: "app/room/newroom.html",
        controller: 'RoomCtrl'
      })
      .state('room', {
        url: '/lobby',
        templateUrl: "app/room/lobby.html",
        controller: 'RoomCtrl'
      });
  })
  .controller('RoomCtrl', function($scope, $http) {

    $http.get('/rooms').then(function(response) {
      console.log(response);
      $scope.rooms = response.data;
    });
  });
