// src/models/Note.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String,
    index: true,
    required: true
  },
  content: {
    type: String,
    index: true,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
