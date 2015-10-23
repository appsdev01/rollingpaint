var sketchbooks = require('../controllers/sketchbooks.server.controller');

module.exports = function(app) {


  app.route('/api/sketchbooks/:userId')
    .post(sketchbooks.createSketchbook);

  app.route('/api/sketchbooks/:userId/paper')
    .post(sketchbooks.countTurn);

  app.route('/api/sketchbooks/:userId')
    .get(sketchbooks.getSketchbook);
};
