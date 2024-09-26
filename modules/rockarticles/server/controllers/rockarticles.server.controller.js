'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rockarticle = mongoose.model('Rockarticle'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an rockarticle
 */
exports.create = function (req, res) {
  var rockarticle = new Rockarticle(req.body);
  rockarticle.user = req.user;

  rockarticle.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rockarticle);
    }
  });
};

/**
 * Show the current rockarticle
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var rockarticle = req.rockarticle ? req.rockarticle.toJSON() : {};

  // Add a custom field to the Rockarticle, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Rockarticle model.
  rockarticle.isCurrentUserOwner = !!(req.user && rockarticle.user && rockarticle.user._id.toString() === req.user._id.toString());

  res.json(rockarticle);
};

/**
 * Update an rockarticle
 */
exports.update = function (req, res) {
  var rockarticle = req.rockarticle;

  rockarticle.title = req.body.title;
  rockarticle.content = req.body.content;

  rockarticle.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rockarticle);
    }
  });
};

/**
 * Delete an rockarticle
 */
exports.delete = function (req, res) {
  var rockarticle = req.rockarticle;

  rockarticle.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rockarticle);
    }
  });
};

/**
 * List of Rockarticles
 */
exports.list = function (req, res) {
  Rockarticle.find().sort('-created').populate('user', 'displayName').exec(function (err, rockarticles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rockarticles);
    }
  });
};

/**
 * Rockarticle middleware
 */
exports.rockarticleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rockarticle is invalid'
    });
  }

  Rockarticle.findById(id).populate('user', 'displayName').exec(function (err, rockarticle) {
    if (err) {
      return next(err);
    } else if (!rockarticle) {
      return res.status(404).send({
        message: 'No rockarticle with that identifier has been found'
      });
    }
    req.rockarticle = rockarticle;
    next();
  });
};
