'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Interviews Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/interviews',
      permissions: '*'
    }, {
      resources: '/api/interviews/:interviewId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/interviews',
      permissions: ['get', 'post']
    }, {
      resources: '/api/interviews/:interviewId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/interviews',
      permissions: ['get']
    }, {
      resources: '/api/interviews/:interviewId',
      permissions: ['get']
    }]
  }, {
    roles: ['admin', 'user', 'guest'],
    allows: [{
      resources: '/api/interviews/read-slug',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Interviews Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an interview is being processed and the current user created it then allow any manipulation
  if (req.interview && req.user && req.interview.user && req.interview.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
