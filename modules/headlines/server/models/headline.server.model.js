'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Headline Schema
 */
var HeadlineSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  base64img: {
    type: String,
      default: '',
      trim: true
  },
    imgurl:{ 
    type: String, 
    default: '',
    trim: true
  },
  photocaption: {
    type: String,
      default: '',
      trim: true
  },
    photo: {
    type: String,
      default: '',
      trim: true
  },
    author: {
    type: String,
      default: '',
      trim: true
  },
    description: {
    type: String,
      default: '',
      trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Headline', HeadlineSchema);
