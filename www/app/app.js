// Ionic Starter App

angular.module('starter', ['ionic', 'ionic.contrib.frostedGlass',
    'angularMoment', 'picture', 'ranking', 'guessword', 'word', 'intro',
    'register', 'profile', 'lobby', 'sketch', 'chat', 'room',
  ])
  .run(function($ionicPlatform, amMoment) {
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
    amMoment.changeLocale('ko');
  })
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // if none of the above states are matched, use this as the fallback
    $ionicConfigProvider.views.maxCache(0);
    $urlRouterProvider.otherwise('/intro');
  })
  .factory('chatSocket', function($rootScope, $location) {
    var socketUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/chat-socket';
    console.log(socketUrl);

    var socket = io.connect('/chat');
    console.log(socket);

    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
      disconnect: function() {
        socket.disconnect();
      }
    };
  });
