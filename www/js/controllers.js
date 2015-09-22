angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $location) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  })
  .controller('PopupCtrl', function($scope, $timeout, $q, $ionicPopup) {
    $scope.showPopup = function() {
      $scope.data = {};
      $ionicPopup.show({
        templateUrl: 'popup-template.html',
        title: 'Enter Wi-Fi Password',
        subTitle: 'WPA2',
        scope: $scope,
        buttons: [{
          text: 'Cancel',
          onTap: function(e) {
            return true;
          }
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            return $scope.data.wifi;
          }
        }, ]
      }).then(function(res) {
        console.log('Tapped!', res);
      }, function(err) {
        console.log('Err:', err);
      }, function(msg) {
        console.log('message:', msg);
      });

      $timeout(function() {
        $ionicPopup.alert({
          title: 'Unable to connect to network'
        }).then(function(res) {
          console.log('Your love for ice cream:', res);
        });
      }, 1000);
    };

    $scope.showConfirm = function() {
      $ionicPopup.confirm({
        title: '좋아요 채점!',
        content: 'Billy님의 그림 어떠세요?'
      }).then(function(res) {
        if (res) {
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }

      });
    };
    $scope.showPrompt = function() {
      $scope.data = {};

      $ionicPopup.show({
        templateUrl: '좋아요 채점!',
        title: '좋아요 채점!',
        subTitle: 'Billy님의 그림 어떠세요?',
        scope: $scope,
        buttons: [{
          text: '좋아요'
        }, {
          text: '싫어요',
          type: 'button-positive'
        }, ]
      }).then(function(res) {
        console.log('Tapped!', res);
      }, function(err) {
        console.log('Err:', err);
      }, function(msg) {
        console.log('message:', msg);
      });

    };
    $scope.showPasswordPrompt = function() {
      $ionicPopup.prompt({
        title: 'Password Check',
        subTitle: 'Enter your secret password',
        inputType: 'password',
        inputPlaceholder: 'Your password'
      }).then(function(res) {
        console.log('Your name is', res);
      });
    };
    $scope.showAlert = function() {
      $ionicPopup.alert({
        title: 'Don\'t eat that!',
        content: 'That\'s my sandwich'
      }).then(function(res) {
        console.log('Thank you for not eating my delicious ice cream cone');
      });
    };
  });
