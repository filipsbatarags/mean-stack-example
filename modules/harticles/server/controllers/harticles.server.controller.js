'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Harticle = mongoose.model('Harticle'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an harticle
 */
exports.create = function (req, res) {
  var harticle = new Harticle(req.body);
  harticle.user = req.user;

  harticle.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(harticle);
    }
  });
};

/**
 * Show the current harticle
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var harticle = req.harticle ? req.harticle.toJSON() : {};

  // Add a custom field to the Harticle, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Harticle model.
  harticle.isCurrentUserOwner = !!(req.user && harticle.user && harticle.user._id.toString() === req.user._id.toString());

  res.json(harticle);
};

/**
 * Update an harticle
 */
exports.update = function (req, res) {
  var harticle = req.harticle;

  harticle.title = req.body.title;
  harticle.content = req.body.content;

  harticle.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(harticle);
    }
  });
};

/**
 * Delete an harticle
 */
exports.delete = function (req, res) {
  var harticle = req.harticle;

  harticle.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(harticle);
    }
  });
};

/**
 * List of Harticles
 */
exports.list = function (req, res) {
  Harticle.find().sort('-created').populate('user', 'displayName').exec(function (err, harticles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(harticles);
    }
  });
};

/**
 * Harticle middleware
 */
exports.harticleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Harticle is invalid'
    });
  }

  Harticle.findById(id).populate('user', 'displayName').exec(function (err, harticle) {
    if (err) {
      return next(err);
    } else if (!harticle) {
      return res.status(404).send({
        message: 'No harticle with that identifier has been found'
      });
    }
    req.harticle = harticle;
    next();
  });
};
