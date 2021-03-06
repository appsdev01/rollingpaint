var guesswords = require('../controllers/guesswords.server.controller');

module.exports = function(app) {

//입력된 단어 페이퍼 조회
//단어 맞추기 화면에서 입력한 단어 저장
app.route('/api/guesswords/:sketchbookId/paper')
    .post(guesswords.createPaper);

// get/turn
// 게임 진행시, 몇 번째인지 카운팅 하여 화면에 보여주기
// 조건 : roomid, gameid, userid, sketchbook

// get/picture/forgame
// 단어 맞추기 화면에 뿌려줄 그림 조회
// 조건 : roomid, gameid, userid, sketchbook, pictureid

// post/input/word/forgame
// 단어 맞추기 화면에서 입력된 단어를 저장
// 조건 : roomid, gameid, userid, sketchbook, pictureid

};
