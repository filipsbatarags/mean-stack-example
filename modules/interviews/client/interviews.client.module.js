(function (app) {
  'use strict';

  app.registerModule('interviews', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('interviews.services');
  app.registerModule('interviews.routes', ['ui.router', 'core.routes', 'interviews.services']);
}(ApplicationConfiguration));
