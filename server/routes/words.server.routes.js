var words = require('../controllers/words.server.controller');
var sketchbooks = require('../controllers/sketchbooks.server.controller');

module.exports = function(app) {
  app.route('/api/words/wordList/:roomId/seq/:userSeq')
    .get(words.get);
/*
  app.route('/api/sketchbooks/:userId')
    .post(sketchbooks.createSketchbook);
    */
};
