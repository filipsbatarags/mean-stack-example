'use strict';

/**
 * Module dependencies
 */
var interviewsPolicy = require('../policies/interviews.server.policy'),
  interviews = require('../controllers/interviews.server.controller');

module.exports = function (app) {
  // Interviews collection routes
  app.route('/api/interviews').all(interviewsPolicy.isAllowed)
    .get(interviews.list)
    .post(interviews.create);
    
    //Single interview routes via slug
    app.route('/api/interviews/read-slug').get(interviewsPolicy.isAllowed,
    interviews.readBySlug);

  // Single interview routes
  app.route('/api/interviews/:interviewId').all(interviewsPolicy.isAllowed)
    .get(interviews.read)
    .put(interviews.update)
    .delete(interviews.delete);

  // Finish by binding the interview middleware
  app.param('interviewId', interviews.interviewByID);
};
