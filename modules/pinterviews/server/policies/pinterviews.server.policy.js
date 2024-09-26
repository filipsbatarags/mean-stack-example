'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Pinterviews Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/pinterviews',
      permissions: '*'
    }, {
      resources: '/api/pinterviews/:pinterviewId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/pinterviews',
      permissions: ['get', 'post']
    }, {
      resources: '/api/pinterviews/:pinterviewId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/pinterviews',
      permissions: ['get']
    }, {
      resources: '/api/pinterviews/:pinterviewId',
      permissions: ['get']
    }]
  }, {
    roles: ['admin', 'user', 'guest'],
    allows: [{
      resources: '/api/pinterviews/read-slug',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Pinterviews Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If a pinterview is being processed and the current user created it then allow any manipulation
  if (req.pinterview && req.user && req.pinterview.user && req.pinterview.user.id === req.user.id) {
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
