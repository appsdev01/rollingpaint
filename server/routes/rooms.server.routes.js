var rooms = require('../controllers/rooms.server.controller');

module.exports = function(app) {
  app.route('/api/rooms')
    .get(rooms.list)
    .post(rooms.create);

  app.route('/api/rooms/:roomId')
    .get(rooms.get)
    .delete(rooms.delete)
    .put(rooms.update);

  app.route('/api/rooms/:roomId/users')
    .post(rooms.join);

  app.route('/api/rooms/:roomId/users/:userId')
    .delete(rooms.leave);

  app.route('/api/rooms/:roomId/owner')
    .post(rooms.delegate);

  app.route('/api/rooms/:roomId/users/:userId')
    .put(rooms.userUpdate);
};
