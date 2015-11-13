var sketchbooks = require('../controllers/sketchbooks.server.controller');

module.exports = function(app) {
/*
  app.route('/api/sketchbooks/:userId')
    .post(sketchbooks.createSketchbook);
*/
  // POST, GET(목록 조회) 특정 ID 없이 사용
  app.route('/api/sketchbooks')
    .post(sketchbooks.create);

  app.route('/api/sketchbooks/:sketchbookId')
    .get(sketchbooks.get)
    .put(sketchbooks.update)
    .delete(sketchbooks.delete);

  app.route('/api/sketchbooks/:sketchbookId/paper')
    .get(sketchbooks.listPaper)
    .post(sketchbooks.createPaper);

  app.route('/api/sketchbooks/:sketchbookId/paper/:paperId')
    .get(sketchbooks.getPaper)
    .put(sketchbooks.updatePaper)
    .delete(sketchbooks.deletePaper);

/*
  app.route('/api/sketchbooks/:userId/imageURL')
    .post(sketchbooks.savePaperImage);
    */
};
