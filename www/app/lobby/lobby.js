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

    $scope.roomData = {
      // "title": "",
      // "password": ""
      // user 별 ready 상태 필드 추가
    };

    // Perform the login action when the user submits the login form
    $scope.createRoom = function(req,res) {
      //console.log('Doing login', $scope.loginData);
      console.log('Create a Room', $scope.roomData);

      $http({
        method: 'POST',
        url: 'rooms/create',
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
          window.location.href = '#/lobby'; // 방으로 들어가도록 고쳐야 함
          console.log('Create a Room Success !!!');
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
