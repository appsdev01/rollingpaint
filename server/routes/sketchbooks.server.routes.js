var sketchbooks = require('../controllers/sketchbooks.server.controller');

module.exports = function(app) {
  app.route('/api/sketchbooks/:userId/paper/:paper')
    .post(sketchbooks.countTurn);

  app.route('/api/sketchbooks/:userId')
    .get(sketchbooks.getSketchbook);
//'/api/sketchbooks/imageURL/:imageURL'
  app.route('/api/sketchbooks/imageURL/:userId')
    .post(sketchbooks.saveImageToLocal);
};
