'use strict';

/**
 * Module dependencies
 */
var harticlesPolicy = require('../policies/harticles.server.policy'),
  harticles = require('../controllers/harticles.server.controller');

module.exports = function (app) {
  // Hharticles collection routes
  app.route('/api/harticles').all(harticlesPolicy.isAllowed)
    .get(harticles.list)
    .post(harticles.create);

  // Single harticle routes
  app.route('/api/harticles/:harticleId').all(harticlesPolicy.isAllowed)
    .get(harticles.read)
    .put(harticles.update)
    .delete(harticles.delete);

  // Finish by binding the harticle middleware
  app.param('harticleId', harticles.harticleByID);
};
