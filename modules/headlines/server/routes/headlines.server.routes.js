'use strict';

/**
 * Module dependencies
 */
var headlinesPolicy = require('../policies/headlines.server.policy'),
  headlines = require('../controllers/headlines.server.controller'),
    multer = require('multer');

module.exports = function (app) {
    //app.use(multer({ dest: '../../../core/client/img/content/'}));
    
  //app.route('/api/headlines/uploadimage').all(headlinesPolicy.isAllowed)
          //.post(headlines.uploadimage);

    //Headlines image upload
    //app.route('/api/headlines/uploadimage').all(headlinesPolicy.isAllowed)
     //.post(headlines.uploadimage);
    
  // Headlines collection routes
  app.route('/api/headlines').all(headlinesPolicy.isAllowed)
    .get(headlines.list)
    .post(headlines.create);

  // Single headline routes
  app.route('/api/headlines/:headlineId').all(headlinesPolicy.isAllowed)
    .get(headlines.read)
    .put(headlines.update)
    .delete(headlines.delete);

  // Finish by binding the headline middleware
  app.param('headlineId', headlines.headlineByID);
};




