// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic.contrib.frostedGlass'])

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

  .state('intro', {
    url: '/intro',
    templateUrl: "templates/intro.html",
    controller: 'AppCtrl'
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.lobby', {
    url: '/lobby',
    views: {
      'menuContent': {
        templateUrl: "templates/lobby.html"
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: "templates/login.html"
  })

  .state('app.room', {
    url: '/room',
    views: {
      'menuContent': {
        templateUrl: "templates/room.html"
      }
    }
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })

  .state('canvas', {
    url: "/canvas",
    templateUrl: "templates/canvas.html",
    controller: 'CanvasCtrl'
  })

  .state('app.playlists', {
    url: "/playlists",
    views: {
      'menuContent': {
        templateUrl: "templates/playlists.html",
        controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  })

  // ddangddnag
  .state('chat', {
    url: '/chat',
    templateUrl: "templates/chat.html"
  })

  //sehee
  .state('app.word', {
    url: "/word",
    views: {
      'menuContent': {
        templateUrl: "templates/word.html",
        controller: 'WordCtrl'
      }
    }
  })

  //hyona
  .state('app.ranking', {
    url: "/ranking",
    views: {
      'menuContent': {
        templateUrl: "templates/ranking.html",
        controller: 'RankingCtrl'
      }
    }
  })

  .state('app.inputword', {
    url: "/inputword",
    views: {
      'menuContent': {
        templateUrl: "templates/inputword.html",
        controller: 'InputwordCtrl'
      }
    }
  })

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
