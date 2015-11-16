var users = require('../controllers/users.server.controller');

module.exports = function(app) {
  app.route('/api/users/me')
    .get(users.me);

  app.route('/api/users/:userId')
    .get(users.get);
};
