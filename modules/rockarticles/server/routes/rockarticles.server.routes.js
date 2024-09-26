'use strict';

/**
 * Module dependencies
 */
var rockarticlesPolicy = require('../policies/rockarticles.server.policy'),
  rockarticles = require('../controllers/rockarticles.server.controller');

module.exports = function (app) {
  // Hrockarticles collection routes
  app.route('/api/rockarticles').all(rockarticlesPolicy.isAllowed)
    .get(rockarticles.list)
    .post(rockarticles.create);

  // Single rockarticle routes
  app.route('/api/rockarticles/:rockarticleId').all(rockarticlesPolicy.isAllowed)
    .get(rockarticles.read)
    .put(rockarticles.update)
    .delete(rockarticles.delete);

  // Finish by binding the rockarticle middleware
  app.param('rockarticleId', rockarticles.rockarticleByID);
};
