(function (app) {
  'use strict';

  app.registerModule('harticles', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('harticles.services');
  app.registerModule('harticles.routes', ['ui.router', 'core.routes', 'harticles.services']);
}(ApplicationConfiguration));
