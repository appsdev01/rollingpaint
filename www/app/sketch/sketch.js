angular.module('sketch', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('sketch', {
        url: '/sketch',
        templateUrl: "app/sketch/sketch.html",
        controller: 'SketchCtrl'
      });
  })
  .controller('SketchCtrl', function($scope, $http) {
    var canvas = document.getElementById('paper');
    var ratio = Math.max(window.devicePixelRatio || 1, 1);

    console.log(canvas);
    console.log(window);
    $scope.canvas = angular.toJson(canvas);
    $scope.window = angular.toJson(window);

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
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        console.log('x = ' + x + ', y = ' + y);
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
        var x = touch.clientX - rect.left;
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
  });
