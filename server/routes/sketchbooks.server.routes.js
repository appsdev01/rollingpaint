var sketchbooks = require('../controllers/sketchbooks.server.controller');

module.exports = function(app) {
  app.route('/api/sketchbooks/:userId')
    .post(sketchbooks.createSketchbook);

//  app.route('/api/sketchbooks/:sketchbookId/paper')
//    .post(sketchbooks.countTurn);

  app.route('/api/sketchbooks')
    //.get(sketchbooks.list)
    .post(sketchbooks.createSketchbook);

  app.route('/api/sketchbooks/:sketchbookId')
    .get(sketchbooks.get) //특정 스케치북 조회
    .put(sketchbooks.update) // 특정 스케치북 업데이트(수정)
    .delete(sketchbooks.delete); // 특정 스케치북 삭제

  app.route('/api/sketchbooks/:sketchbookId/paper')
    .get(sketchbooks.listPaper) // 스케치북에 있는 paper 전체 조회
    .post(sketchbooks.createPaper); // 스케치북에 paper생성

  app.route('/api/sketchbooks/:sketchbookId/paper/:paperId')
    .get(sketchbooks.listPaper) // 스케치북에 있는 paper 전체 조회
    .put(sketchbooks.updatePaper) // 스케치북에서 특정 paper update
    .delete(sketchbooks.deletePaper); // 스케치북에서 paper삭제
/*
  app.route('/api/sketchbooks/:userId/imageURL')
    .post(sketchbooks.savePaperImage);
    */
};
