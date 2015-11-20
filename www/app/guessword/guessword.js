angular.module('guessword', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('guessword', {
        url: '/guessword',
        templateUrl: "app/guessword/guessword.html",
        controller: 'GuesswordCtrl',
        params: {
        sketchbookId: null,
        userId:null,
        roomId:null
         }
      });
  })

.controller('GuesswordCtrl', function($scope, $interval, $ionicPopup, $ionicBackdrop, $timeout, $http, $stateParams, $state) {

  $scope.clickSavePaperYn = false;
  $scope.userId = $stateParams.userId;
  $scope.roomId = $stateParams.roomId;
  $scope.sketchbookId =  $stateParams.sketchbookId;
  console.log('useridccccccc' + $scope.userId);
  console.log('roomIdccccccccc' + $scope.roomId);

  $http.get('/api/sketchbooks/' + $stateParams.sketchbookId + '/paper').then(function(response) {
       console.log(response.data.papers);
       console.log(response.data.papers[response.data.papers.length - 1]);

       $scope.paperImage = response.data.papers[response.data.papers.length - 1].picture + ".jpg";
       //window.location.href = response.data.papers[response.data.papers.length - 1].picture + ".jpg";
     });

     $http.get('/api/rooms/' + $scope.roomId, {
       cache: false
     }).then(function(response) {
       $scope.room = response.data;
       console.log($scope.room);
     });

     // 접속자 정보 조회
     $http.get('/api/users/me', {
       cache: false
     }).then(function(response) {
       $scope.user = response.data;
       console.log($scope.user);
     });

    //단어입력 시간 카운트
    $scope.timeCount = 30;
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
          if(!$scope.clickSavePaperYn){ // 저장 안 했을경우, 강제 저장
            $scope.savePaper();
          }
        $scope.changeDisplay();
        }, 3000);
      }
    }, 1000, $scope.timeCount);

    //입력 단어 저장할 페이퍼 만들어서 추가
    $scope.inputanswer = "";
    $scope.savePaper = function() {
      console.log('save Answer!');
      var inputAnswer = document.getElementById("paperanswer").value;
      console.log(document.getElementById("paperanswer").value);

      $scope.clickSavePaperYn = true;

      $http({
        method: 'POST',
        url: '/api/guesswords/' + $scope.sketchbookId + '/paper',
        data: {
          "userId": $scope.user._id,
          "type": 'word',
          "answer": inputAnswer,
          "picture": '',
          "score": 0
        }
      }).success(function(responseData) {

        // 05: 단어 맞추기
        $http.put('/api/rooms/' + $stateParams.roomId + '/users/' + $scope.userId, {
          status: '05'
        }).then(function(response) {
          console.log(response.data);
          //$scope.room = response.data;
        });
      });
    };

    $scope.changeDisplay = function() {
      $http.get('/api/rooms/' + $scope.roomId).then(function(response) {
        $scope.sketchbooks = response.data.sketchbooks;
        console.log($scope.sketchbooks);
        // 내 바로 전사람의 스케치북 가져오기
        var preUserSeq = $scope.seqId === "1" ? $scope.sketchbooks.length - 1 : $scope.seqId - 2;
        var preUserSketchbookId = $scope.sketchbooks[preUserSeq];

        $http.get('/api/sketchbooks/' + preUserSketchbookId + '/paper').then(function(response) {
          $state.go('sketch', { sketchbookId: preUserSketchbookId, userId: $scope.userId, roomId: $scope.roomId});
        });
      });

    };

  });
