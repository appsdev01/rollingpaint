# Rolling Paint
연구회 실습 프로젝트

# 협업 가이드

### 화면 추가
* www/templates/ 디렉토리에 HTML 문서 추가
* www/js/app.js를 수정하여 화면 연결
```javascript
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    // 아래와 같이 state()를 통해 추가한 화면을 연결
    .state('myscreen', { // state 이름
      url: '/myscreen', // URL 맵핑
      templateUrl: "templates/myscreen.html" // 템플릿 경로
    })
```
