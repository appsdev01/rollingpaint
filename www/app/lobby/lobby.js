angular.module('lobby', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('lobby', {
        url: '/lobby',
        templateUrl: "app/lobby/lobby.html",
        controller: 'LobbyCtrl'
      });
  })
  .controller('LobbyCtrl', function($scope, $http, $ionicModal) {

    // $http.get('/rooms').then(function(response) {
    //   console.log("maybe no response");
    //   console.log(response);
    //   $scope.rooms = response.data;
    // });

    // get my profile
    $http.get('/users/me').then(function(response) {
      $scope.user = response.data;
    });

    $http.get('/rooms').then(function(response) {
      $scope.roomList = response.data;
      console.log($scope.roomList);
    });

    $scope.roomData = {};

    $scope.joinRoom = function(req, res) {

      // password 입력 후 기존 방의 password와 다르면 튕기도록 처리

      $http({
        method: 'PUT',
        url: 'rooms/'+req._id+'/'+$scope.user._id

        // data: {
        //   "id": req._id,
        //   "userId": $scope.user._id
        // }
      }).success(function(response) {
        if (response) {
          window.location.href = '#/chat'; // 방으로 들어가도록 고쳐야 함
          $scope.closeNewRoom();
        }
      });
    };

    // Perform the login action when the user submits the login form
    $scope.createRoom = function(req, res) {

      // 유효성 체크 필요 (Title, capacity 미설정 시 또는 Password 체크 후 값 미입력 시)
      $http({
        method: 'POST',
        url: 'rooms',
        data: {
          // "email": $scope.loginData.email,
          // "password": $scope.loginData.password
          "title": $scope.roomData.title,
          "password": $scope.roomData.password,
          "capacity": parseInt($scope.roomData.capacity),
          "ownerId": $scope.user._id, // ownerID
          //"status": "01", // 01: opened(default), 02: playing, 03: ended
          "wordseed": Math.floor(Math.random() * 1000)+1,
          //"gameround": 0,
          "users": [{userId: $scope.user._id}]
        }
      }).success(function(response) {
        if (response) {
          window.location.href = '#/chat'; // 방으로 들어가도록 고쳐야 함
          $scope.closeNewRoom();
        }
      });
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('app/lobby/newroom.html', {
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
