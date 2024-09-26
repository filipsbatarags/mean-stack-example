(function (app) {
  'use strict';

  app.registerModule('rockarticles', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('rockarticles.services');
  app.registerModule('rockarticles.routes', ['ui.router', 'core.routes', 'rockarticles.services']);
}(ApplicationConfiguration));
