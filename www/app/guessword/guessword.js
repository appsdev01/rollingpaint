angular.module('guessword', ['ionic'])
  .config(function($stateProvider) {
    $stateProvider
      .state('guessword', {
        url: '/guessword',
        templateUrl: "app/guessword/guessword.html",
        controller: 'GuesswordCtrl'
      });
  })

  .controller('GuesswordCtrl', function($scope, $interval, $ionicPopup, $ionicBackdrop, $timeout, $http, $location) {
    param = $location.search();

    $http.get('/api/sketchbooks/' + param.sketchbookId + '/paper').then(function(response) {
      console.log("sketchbooks 조회!!!!!!!!!!");
      console.log(response.data.papers);
      console.log(response.data.papers[response.data.papers.length - 1]);

      $scope.paperImage = response.data.papers[response.data.papers.length - 1].picture + ".jpg";
      //window.location.href = response.data.papers[response.data.papers.length - 1].picture + ".jpg";
    });


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
    //입력 단어 저장 및 채점



  });
