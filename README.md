# Rolling Paint [![Build Status](https://travis-ci.org/appsdev01/rollingpaint.svg?branch=master)](https://travis-ci.org/appsdev01/rollingpaint)
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
# Git

### Git 사용 절차
리모트 등록
```console
git remote add --track master upstream https://github.com/appsdev01/rollingpaint.git
```
리모트(최초 원본) 소스 가져오기
```console
git fetch upstream
```
가져온 리모트(최초 원본) 소스 합치기
```console
git merge upstream/master
```
작업한 소스 커밋
```console
git add .
git commit -m "커밋 내용"
```
 리모트(포크)로 소스 보내기
```console
git push origin master
```
Gibhub에서 Pull Request 생성

# Backend 구조
server 아래 picture 참고
```
server.js --> routes/*.js --> controllers/*.js --> models/*.js
```
