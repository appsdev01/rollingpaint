var sketchbooks = require('../controllers/sketchbooks.server.controller');

module.exports = function(app) {
  app.route('/api/sketchbooks/:userId')
    .post(sketchbooks.createSketchbook);

  app.route('/api/sketchbooks/:sketchbookId/paper')
    .post(sketchbooks.countTurn);

/*
  app.route('/api/sketchbooks/:userId')
    .get(sketchbooks.getSketchbook);
*/
  app.route('/api/sketchbooks/:userId/imageURL')
    .post(sketchbooks.saveImageToLocal);
};
