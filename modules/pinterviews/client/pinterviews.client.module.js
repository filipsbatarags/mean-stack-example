(function (app) {
  'use strict';

  app.registerModule('pinterviews', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('pinterviews.services');
  app.registerModule('pinterviews.routes', ['ui.router', 'core.routes', 'pinterviews.services']);
}(ApplicationConfiguration));
