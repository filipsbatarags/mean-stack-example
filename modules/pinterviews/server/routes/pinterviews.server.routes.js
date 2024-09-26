'use strict';

/**
 * Module dependencies
 */
var pinterviewsPolicy = require('../policies/pinterviews.server.policy'),
  pinterviews = require('../controllers/pinterviews.server.controller');

module.exports = function (app) {
  // Pinterviews collection routes
  app.route('/api/pinterviews').all(pinterviewsPolicy.isAllowed)
    .get(pinterviews.list)
    .post(pinterviews.create);
    
    //Single pinterview routes via slug
    app.route('/api/pinterviews/read-slug').get(pinterviewsPolicy.isAllowed,
    pinterviews.readBySlug);

  // Single pinterview routes
  app.route('/api/pinterviews/:pinterviewId').all(pinterviewsPolicy.isAllowed)
    .get(pinterviews.read)
    .put(pinterviews.update)
    .delete(pinterviews.delete);

  // Finish by binding the pinterview middleware
  app.param('pinterviewId', pinterviews.pinterviewByID);
};
