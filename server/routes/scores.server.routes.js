var scores = require('../controllers/scores.server.controller');

module.exports = function(app) {
  app.route('/api/scores')
    .post(scores.createScore);

  app.route('/api/scores/gamescore/:roomid/user/:id')
    .put(scores.updateGameScore);

  app.route('/api/scores/popularityscore/:roomid/user/:id')
    .put(scores.updatePopularityScore);

  app.route('/api/scores/:id')
    .get(scores.getScore);
};
