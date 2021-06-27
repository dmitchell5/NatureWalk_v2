
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var diarySchema = Schema( {
  walkDate: Date,
  photo: String,
  location: String,
  comments: String,
  userId: ObjectId,
  identifications: [String],
  songs: [String],
} );

module.exports = mongoose.model( 'Diary', diarySchema );
