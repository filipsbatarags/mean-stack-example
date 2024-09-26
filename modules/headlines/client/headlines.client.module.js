(function (app) {
  'use strict';

  app.registerModule('headlines', ['core', 'textAngular']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('headlines.services');
  app.registerModule('headlines.routes', ['ui.router', 'core.routes', 'headlines.services']);
}(ApplicationConfiguration));
