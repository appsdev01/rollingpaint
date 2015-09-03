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

    $http.get('/rooms').then(function(response) {
      console.log(response);
      $scope.rooms = response.data;
    });

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
        url: 'rooms',
        data: {
          // "email": $scope.loginData.email,
          // "password": $scope.loginData.password
          "title": $scope.roomData.title,
          "password": $scope.roomData.password,
          "capaticy": $scope.roomData.capaticy,
          "ownerId": "wBd9fbo", // 하드코딩 추후에 로그인 데이터 받아올 예정
          "status": "01",
          "wordseed": 0,
          "gameround": 0,
          "users": [{userId: "wBd9fbo"}],
          "sketchbooks": ["a"]
        }
      }).success(function(response) {
        if (response) {
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
