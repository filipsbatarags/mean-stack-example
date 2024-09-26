'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pinterview = mongoose.model('Pinterview'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a pinterview
 */
exports.create = function (req, res) {
  var pinterview = new Pinterview(req.body);
  pinterview.user = req.user;

  pinterview.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pinterview);
    }
  });
};

/**
 * Show the current pinterview
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var pinterview = req.pinterview ? req.pinterview.toJSON() : {};

  // Add a custom field to the Interview, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Interview model.
  pinterview.isCurrentUserOwner = !!(req.user && pinterview.user && pinterview.user._id.toString() === req.user._id.toString());

  res.json(pinterview);
};

/**
 * Update an pinterview
 */
exports.update = function (req, res) {
  var pinterview = req.pinterview;

  pinterview.title = req.body.title;
  pinterview.content = req.body.content;

  pinterview.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pinterview);
    }
  });
};

/**
 * Delete a pinterview
 */
exports.delete = function (req, res) {
  var pinterview = req.pinterview;

  pinterview.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pinterview);
    }
  });
};

/**
 * List of Pinterviews
 */
exports.list = function (req, res) {
  Pinterview.find().sort('-created').populate('user', 'displayName').exec(function (err, pinterviews) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pinterviews);
    }
  });
};

/**
 * Pinterview middleware
 */
exports.pinterviewByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pinterview is invalid'
    });
  }

  Pinterview.findById(id).populate('user', 'displayName').exec(function (err, pinterview) {
    if (err) {
      return next(err);
    } else if (!pinterview) {
      return res.status(404).send({
        message: 'No pinterview with that identifier has been found'
      });
    }
    req.pinterview = pinterview;
    next();
  });
};

exports.readBySlug = function(req , res){
    Pinterview.findOne(req.query).populate('user',
    'displayName').exec(function(err, pinterview) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        } else {
        res.json(pinterview);
        }
    });
};
