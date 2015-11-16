angular.module('profile', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: "app/profile/profile.html",
        controller: 'ProfileCtrl'
      });

  })
  .controller('ProfileCtrl', function($scope, $http, $ionicModal) {
    $scope.editData = {};
    // get my profile
    $http.get('/api/users/me').then(function(response) {
      $scope.user = response.data;
    });

    // 방만들기 모달
    $ionicModal.fromTemplateUrl('app/profile/editprofile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalEditProfile = modal;
    });

    $scope.openEditProfile = function() {
      $scope.modalEditProfile.show();
    };

    $scope.closeEditProfile = function() {
      $scope.modalEditProfile.hide();
    };

    $scope.saveProfile = function() {
      // 유효성 체크 필요 (Title, capacity 미설정 시 또는 Password 체크 후 값 미입력 시)
      if ($scope.editData.username === undefined || $scope.editData.username === "") {
        $scope.nameAlert = true;
        return;
      }

      $http({
        method: 'POST',
        url: 'editprofile',
        data: {
          username: $scope.editData.username,
          userId: $scope.user._id
        }
      }).success(function(response) {
        if (response) {
          window.location.href = '#/lobby'; // 방으로 들어가도록 고쳐야 함
          $scope.closeEditProfile();
        }
      });
    };
  });
