'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    _ = require('lodash'),
  mongoose = require('mongoose'),
  Headline = mongoose.model('Headline'),
    multer = require('multer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an headline
 */
exports.create = function (req, res) {
  var headline = new Headline(req.body);
  headline.user = req.user;

  headline.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(headline);
    }
  });
};

/**
 * Show the current headline
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var headline = req.headline ? req.headline.toJSON() : {};

  // Add a custom field to the Headline, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Headline model.
  headline.isCurrentUserOwner = !!(req.user && headline.user && headline.user._id.toString() === req.user._id.toString());

  res.json(headline);
};


//testing multer
var storage = multer.diskStorage({
    destination: function (req,file, callback) {
        callback(null, '../../../core/client/img/content');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+file.originalname);
    }
});

var upload = multer({storage: storage}).single('myFile');

   /* app.post('/myAction', function(req,res) {
    upload(req,res, function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded.");
    });
});*/
//testing multer end


/**
 * Update an headline
 */
exports.update = function (req, res) {
  var headline = req.headline;

  headline.title = req.body.title;
  headline.content = req.body.content;
  headline.base64img = req.body.base64img;
  headline.imgurl = req.body.imgurl;
  headline.photocaption = req.body.photocaption;
  headline.photo = req.body.photo;
  headline.author = req.body.author;
  headline.description = req.body.description;

  headline.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(headline);
    }
  });
};

/**
 * Delete an headline
 */
exports.delete = function (req, res) {
  var headline = req.headline;

  headline.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(headline);
    }
  });
};

/**
 * List of Headlines
 */
exports.list = function (req, res) {
  Headline.find().sort('-created').populate('user', 'displayName').exec(function (err, headlines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(headlines);
    }
  });
};

/**
 * Headline middleware
 */
exports.headlineByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Headline is invalid'
    });
  }

  Headline.findById(id).populate('user', 'displayName').exec(function (err, headline) {
    if (err) {
      return next(err);
    } else if (!headline) {
      return res.status(404).send({
        message: 'No headline with that identifier has been found'
      });
    }
    req.headline = headline;
    next();
  });
};

//module.exports = _.extend(
//  require('./headlines/headlines.image.controller')
//);
