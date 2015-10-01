var pictures = require('../controllers/pictures.server.controller');

module.exports = function(app) {
  app.route('/api/pictures')
    .get(pictures.list)
    .post(pictures.create);

  app.route('/api/pictures/:pictureId')
    .get(pictures.get)
    .put(pictures.update)
    .delete(pictures.delete);
};
