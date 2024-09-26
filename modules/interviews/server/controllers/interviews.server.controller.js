'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Interview = mongoose.model('Interview'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an interview
 */
exports.create = function (req, res) {
  var interview = new Interview(req.body);
  interview.user = req.user;

  interview.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(interview);
    }
  });
};

/**
 * Show the current interview
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var interview = req.interview ? req.interview.toJSON() : {};

  // Add a custom field to the Interview, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Interview model.
  interview.isCurrentUserOwner = !!(req.user && interview.user && interview.user._id.toString() === req.user._id.toString());

  res.json(interview);
};

/**
 * Update an interview
 */
exports.update = function (req, res) {
  var interview = req.interview;

  interview.title = req.body.title;
  interview.content = req.body.content;

  interview.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(interview);
    }
  });
};

/**
 * Delete an interview
 */
exports.delete = function (req, res) {
  var interview = req.interview;

  interview.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(interview);
    }
  });
};

/**
 * List of Interviews
 */
exports.list = function (req, res) {
  Interview.find().sort('-created').populate('user', 'displayName').exec(function (err, interviews) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(interviews);
    }
  });
};

/**
 * Interview middleware
 */
exports.interviewByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Interview is invalid'
    });
  }

  Interview.findById(id).populate('user', 'displayName').exec(function (err, interview) {
    if (err) {
      return next(err);
    } else if (!interview) {
      return res.status(404).send({
        message: 'No interview with that identifier has been found'
      });
    }
    req.interview = interview;
    next();
  });
};

exports.readBySlug = function(req , res){
    Interview.findOne(req.query).populate('user',
    'displayName').exec(function(err, interview) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        } else {
        res.json(interview);
        }
    });
};
