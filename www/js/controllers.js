angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
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

})

.controller('PageCtrl', function($scope, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {
  var messageOptions = [
    { content: '<p>Wow, this is really something huh?</p>' },
    { content: '<p>Yea, it\'s pretty sweet</p>' },
    { content: '<p>I think I like Ionic more than I like ice cream!</p>' },
    { content: '<p>Gee wiz, this is something special.</p>' },
    { content: '<img src="data:image/jpeg;base64,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" alt=""/>' },
    { content: '<p>Is this magic?</p>' },
    { content: '<p>Am I dreaming?</p>' },
    { content: '<img src="data:image/jpeg;base64,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" alt=""/>'},
    { content: '<p>Am I dreaming?</p>' },
    { content: '<p>Yea, it\'s pretty sweet</p>' },
    { content: '<p>I think I like Ionic more than I like ice cream!</p>' },
  ];

  var messageIter = 0;
  $scope.messages = messageOptions.slice(0, messageOptions.length);

  $scope.input_message = { content: '', self: true };


  $scope.add = function() {
    var nextMessage = messageOptions[messageIter++ % messageOptions.length];
    $scope.messages.push(angular.extend({}, nextMessage));

    // Update the scroll area and tell the frosted glass to redraw itself
    $ionicFrostedDelegate.update();
    $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.send = function() {
    console.log($scope);
    var nextMessage = { content: '<p>' + $scope.input_message.content + '</p>', self: true };
    console.log(nextMessage);
    $scope.messages.push(angular.extend({}, nextMessage));
    $scope.input_message.content = '';

    // Update the scroll area and tell the frosted glass to redraw itself
    $ionicFrostedDelegate.update();
    $ionicScrollDelegate.scrollBottom(true);
  };

})

.controller('CanvasCtrl', function($scope) {
  var canvas = document.getElementById('myCanvas');
  var ratio =  Math.max(window.devicePixelRatio || 1, 1);

  //console.log(ratio);
  canvas.height = canvas.offsetWidth * ratio;
  canvas.width = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);

  //console.dir(canvas);

  var context = canvas.getContext('2d');

  context.font = '15pt Calibri';
  context.fillSStyle = 'blue';
  context.fillText('Draw Something!', 10, 50);

  var mouseButtonDown = false;
  var startX, startY;

  canvas.addEventListener("mousedown", function(event) {
    console.log('mouse down!');
    if (event.which === 1) {
      mouseButtonDown = true;
    }
  });

  canvas.addEventListener("mousemove", function(event) {
    if (mouseButtonDown) {
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left
      var y = event.clientY - rect.top;
      consolo.log('x = ' + x + ', y = ' + y);
    }
  });

  canvas.addEventListener("mouseup", function(event) {
    console.log('mouse up!');
    mouseButtonDown = false;
  });

  canvas.addEventListener("touchstart", function(event) {
    //console.log('touch start!');

    var touch = event.changedTouches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    context.moveTo(startX, startY);

    mouseButtonDown = true;
  });

  canvas.addEventListener("touchmove", function(event) {
    event.preventDefault();

    var touch = event.changedTouches[0];
    //console.log(touch);

    if (mouseButtonDown) {
      var rect = canvas.getBoundingClientRect();
      //console.log(rect);
      var x = touch.clientX - rect.left
      var y = touch.clientY - rect.top;
      //console.log('(' + startX + ', ' + startY + ') -> (' + x + ', ' + y + ')');

      context.beginPath();
      context.moveTo(startX / ratio, startY / ratio);
      context.lineTo(x / ratio, y / ratio);
      context.stroke();

      startX = x;
      startY = y;
    }
  });

  canvas.addEventListener("touchend", function(event) {
    //console.log('touch end!');
    mouseButtonDown = false;
  });


})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('InputwordCtrl', function($scope, $stateParams) {
})



.controller('RankingCtrl', function($scope, $ionicModal) {

  $scope.userlists = [
    { rank: 1, name: 'Berry', popularityscore: 100, gamescore: 3 },
    { rank: 2, name: 'Chansu', popularityscore: 70, gamescore: 5 },
    { rank: 3, name: 'Billy', popularityscore:   0, gamescore: 2 },
    { rank: 4, name: 'Chansu', popularityscore: 70, gamescore: 5 },
    { rank: 5, name: 'Billy', popularityscore:   0, gamescore: 2 },
    { rank: 6, name: 'Chansu', popularityscore: 70, gamescore: 5 }
  ];

});
angular.module('ionic.example', ['ionic'])

 .controller('PopupCtrl', function($scope, $timeout, $q, $ionicPopup) {
     $scope.showPopup = function() {
       $scope.data = {}

       $ionicPopup.show({
         templateUrl: 'popup-template.html',
         title: 'Enter Wi-Fi Password',
         subTitle: 'WPA2',
         scope: $scope,
         buttons: [
           { text: 'Cancel', onTap: function(e) { return true; } },
           {
             text: '<b>Save</b>',
             type: 'button-positive',
             onTap: function(e) {
               return $scope.data.wifi;
             }
           },
         ]
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
         if(res) {
           console.log('You are sure');
         } else {
           console.log('You are not sure');
         }
       });
     };
     $scope.showPrompt = function() {
       $scope.data = {}

       $ionicPopup.show({
         templateUrl: '좋아요 채점!',
         title: '좋아요 채점!',
         subTitle: 'Billy님의 그림 어떠세요?',
         scope: $scope,
         buttons: [
           { text: '좋아요'},
           {
             text: '싫어요',
             type: 'button-positive'
           },
         ]
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
