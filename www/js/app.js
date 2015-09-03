// Ionic Starter App

angular.module('starter', ['ionic', 'picture', 'ranking', 'guessword', 'word', 'intro', 'register', 'profile', 'lobby', 'sketch', 'chat','starter.controllers', 'ionic.contrib.frostedGlass'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // ddangddnag
      .state('chat', {
        url: '/chat',
        templateUrl: "templates/chat.html"
      })
      //hyona
      .state('app.popup', {
        url: "/popup",
        views: {
          'menuContent': {
            templateUrl: "templates/popup.html",
            controller: 'PopupCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/intro');
  });
