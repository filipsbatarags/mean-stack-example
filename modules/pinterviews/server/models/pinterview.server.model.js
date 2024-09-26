'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pinterview Schema
 */
var PinterviewSchema = new Schema({
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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
    slug: {
    type: String,
    default: '',
    trim: true,
    unique: true,
    required: 'Slug cannot be blank'
}
});

mongoose.model('Pinterview', PinterviewSchema);
