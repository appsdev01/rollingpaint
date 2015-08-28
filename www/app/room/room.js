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

    $scope.roomData = {
      "title": "",
      "password": ""
    };

    // Perform the login action when the user submits the login form
    $scope.createRoom = function() {
      //console.log('Doing login', $scope.loginData);
      console.log('Create a Room', $scope.roomData);

      $http({
        method: 'POST',
        url: 'rooms',
        data: {
          // "email": $scope.loginData.email,
          // "password": $scope.loginData.password
          "title": $scope.roomData.title,
          "password": $scope.roomData.password,
          "capaticy": $scope.roomData.capaticy.selected,
          "owner": "wBd9fbo", // 하드코딩 추후에 로그인 데이터 받아올 예정
          "status": "01",
          "step": 0,
          "users": [{
            "_id": "wBd9fbo",
            "word": "",
            "score": 0,
            "profileImage": ""
          }]
        }
      }).success(function(response) {
        if (response) {
          console.log('Create a Room Success !!!');
        }
      });
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/newroom.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalNewRoom = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeNewRoom = function() {
      $scope.modalNewRoom.hide();
    };

    // Open the login modal
    $scope.openNewRoom = function() {
      $scope.modalNewRoom.show();
    };

  });

});
