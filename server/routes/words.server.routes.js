var words = require('../controllers/words.server.controller');

module.exports = function(app) {
  app.route('/api/words/wordList/:roomid/user/:userSeq')
    .get(words.get);
};
