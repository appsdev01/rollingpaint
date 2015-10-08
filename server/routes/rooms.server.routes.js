var rooms = require('../controllers/rooms.server.controller');

module.exports = function(app) {
  app.route('/api/rooms')
    .get(rooms.list)
    .post(rooms.create);

  app.route('/api/rooms/:roomId')
    .get(rooms.get)
    .delete(rooms.delete);

  app.route('/api/rooms/:roomId/user')
    .post(rooms.join)
    .delete(rooms.leave);

  app.route('/api/rooms/:roomId/owner')
    .post(rooms.delegate);
};
