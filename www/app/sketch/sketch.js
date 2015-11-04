angular.module('sketch', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('sketch', {
        url: '/sketch/:sketchbookId/roomId/:roomId/userId/:userId/seqId/:seqId',
        templateUrl: "app/sketch/sketch.html",
        controller: 'SketchCtrl'
      });
  })
  .controller('SketchCtrl', function($scope, $interval, $ionicPopup, $ionicBackdrop, $stateParams, $http) {

    $scope.userId = $stateParams.userId;
    $scope.roomId = $stateParams.roomId;
    $scope.seqId = $stateParams.seqId;
    $scope.sketchbookId = $stateParams.sketchbookId;
    $scope.sketchbooks = {};
    $scope.user = {};

    var canvas = document.getElementById('paper');
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    var scale = Math.min(window.innerHeight, window.innerWidth) / 300;
    console.dir(canvas);
    console.dir(window);
    console.log('ratio = ' + ratio);
    console.log('scale = ' + scale);

    // 저장할 이미지 크기의 일관성을 위하여 캔버스의 크기는
    // 가로, 세로 300px로 설정하며 디바이스에 따라 스케일링을 한다.
    canvas.height = 300 * scale - 25;
    canvas.width = 300 * scale - 25;
    canvas.getContext("2d").scale(scale, scale);

    // 선 스타일 설정
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.lineJoin = ctx.lineCap = 'round';

    // 선들의 집합 - 되돌리기(undo) 기능을 위해 그려진 획을 저장
    var paths = [];
    // 오래된 선들은 되돌리기 목록에서 제외하고 이미지로 저장 - 성능 이슈
    var imageData;

    //단어입력 시간 카운트
    $scope.timeCount = 5;
    $interval(function() {
      $scope.timeCount--;
      if ($scope.timeCount === 0) {
        console.log("hello");
        $ionicBackdrop.retain();
        $ionicPopup.show({
          title: '시간 종료',
          subTitle: '다음 단계로 이동합니다',
        });
        $timeout(function() {
          //게임 다음 단계 페이지 호출!
        }, 3000);
      }
    }, 1000, $scope.timeCount);

    function initSketchbook() {
      paths.length = 0;
      imageData = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function midPointBtw(p1, p2) {
      return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
      };
    }

    function draw() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (imageData) {
        ctx.putImageData(imageData, 0, 0);
      }

      ctx.beginPath();
      //    console.log('paths.length : ' + paths.length);
      for (var j = 0; j < paths.length; j++) {
        points = paths[j];
        var p1 = points[0];
        //    console.log('points[0].x : ' + points[0].x + ', points[0].y : ' + points[0].y + '\n');
        var p2 = points[1];
        ctx.moveTo(p1.x, p1.y);
        for (var i = 1, len = points.length; i < len; i++) {
          var midPoint = midPointBtw(p1, p2);
          ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
          p1 = points[i];
          p2 = points[i + 1];
        }
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        if (paths.length > 10) {
          imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
          paths = paths.slice(-10);
        }
      }
    }

    canvas.addEventListener("mousedown", function(event) {
      // 마우스 왼쪽 버튼 누를 때
      if (event.buttons === 1) {
        var rect = canvas.getBoundingClientRect();
        // 새로운 획을 추가한다.
        paths.push([{
          x: (event.clientX - rect.left) / scale,
          y: (event.clientY - rect.top) / scale
        }]);
      }
    });

    canvas.addEventListener("mousemove", function(event) {
      console.log('mouse in ');
      // 마우스 왼쪽 버튼 누른 상태
      if (event.buttons === 1) {
        // 마지막 획을 이어서 그린다.
        lastPoints = paths[paths.length - 1];
        var rect = canvas.getBoundingClientRect();
        lastPoints.push({
          x: (event.clientX - rect.left) / scale,
          y: (event.clientY - rect.top) / scale
        });
        draw();
      }
    });

    canvas.addEventListener("mouseup", function(event) {
      // console.log('mouse up!');
    });

    canvas.addEventListener("touchstart", function(event) {
      var touch = event.changedTouches[0];
      var rect = canvas.getBoundingClientRect();
      // 새로운 획을 추가한다.
      paths.push([{
        x: (touch.clientX - rect.left) / scale,
        y: (touch.clientY - rect.top) / scale
      }]);
    });

    canvas.addEventListener("touchmove", function(event) {
      event.preventDefault();
      console.log('touch in ');
      // 마지막 획을 이어서 그린다.
      lastPoints = paths[paths.length - 1];
      var touch = event.changedTouches[0];
      var rect = canvas.getBoundingClientRect();
      lastPoints.push({
        x: (touch.clientX - rect.left) / scale,
        y: (touch.clientY - rect.top) / scale
      });
      draw();
    });

    canvas.addEventListener("touchend", function(event) {
      //console.log('touch end!');
    });

    $scope.undoDrawing = function() {
      if (paths.length > 0) {
        paths.pop();
        draw();
      }
    };

    $scope.clearSketchbook = function() {
      initSketchbook();
    };

    $http.get('/api/rooms/' + $scope.roomId, {
      cache: false
    }).then(function(response) {
      $scope.room = response.data;
      console.log($scope.room);
    });

    // 접속자 정보 조회
    $http.get('/users/me', {
      cache: false
    }).then(function(response) {
      $scope.user = response.data;
      console.log($scope.user);
    });

    $scope.savePaper = function() {
      console.log('save Image!');
      var paperImage = document.getElementById("paper");
      var dataURL = paperImage.toDataURL('image/png');

      $http({
        method: 'POST',
        url: '/api/sketchbooks/' + $scope.sketchbookId + '/paper',
        data: {
          "userId": $scope.user._id,
          "type": 'picture',
          "answer": '',
          "picture": dataURL,
          "score": 0
        }
      }).success(function(responseData) {
        $http.get('/api/rooms/' + $scope.roomId).then(function(response) {
          console.log("rooms 조회!!!!!!!!!!");
          $scope.sketchbooks = response.data.sketchbooks;
          console.log($scope.sketchbooks);
          // 내 바로 전사람의 스케치북 가져오기
          var preUserSeq = $scope.seqId === "1" ? $scope.sketchbooks.length - 1 : $scope.seqId - 2;
          var preUserSketchbookId = $scope.sketchbooks[preUserSeq];

          $http.get('/api/sketchbooks/' + preUserSketchbookId + '/paper').then(function(response) {
            console.log("sketchbooks 조회!!!!!!!!!!");
            console.log(response.data.papers);
            console.log(response.data.papers[response.data.papers.length - 1]);
            //window.location.href = response.data.papers[response.data.papers.length - 1].picture;

            // 04: 그림 그리기
            $http.put('/api/rooms/' + $stateParams.roomId + '/users/' + $scope.userId, {
              status: '04'
            }).then(function(response) {
              console.log(response.data);
              //$scope.room = response.data;
            });

          });
        });
      });
    };

    // 초기화 코드
    initSketchbook();
  });
