// src/middleware/noteController.js
const noteService = require('../services/noteService');
const { esClient, createIndex } = require('../config/elasticsearch');
const mongoose = require('mongoose');

async function getNotes(req, res) {
  try {
    const userId = req.user._id;
    const userNotes = await noteService.getNotes(userId);
    res.json(userNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getNoteById(req, res) {
  try {
    const noteId = req.params.id;
    const noteObjectId = new mongoose.Types.ObjectId(noteId);
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const userNote = await noteService.getNoteById(noteObjectId, userObjectId);
    console.log(userNote);
    res.json(userNote);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Bad Request' });
  }
}

async function createNote(req, res, next) {
  try {
    const { title, content } = req.body;
    const ownerId = req.user._id;
    const savedNote = await noteService.createNote(title, content, ownerId);
    res.status(201).json(savedNote);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ error: errorMessage });
  }
}

async function updateNote(req, res, next) {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;
    const ownerId = req.user._id;

    const updatedNote = await noteService.updateNote(noteId, title, content, ownerId);
    res.json(updatedNote);

  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ error: errorMessage });
  }
}

async function deleteNote(req, res, next) {
  try {
    const noteObjectId = req.params.id;
    const ownerObjectId = req.user.id;
    await noteService.deleteNote(noteObjectId, ownerObjectId);

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);

    if (error.message === 'Note not found' || error.message === 'You are not authorized to delete this note') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

async function shareNote(req, res, next) {
  try {
    const noteId = req.params.id;
    const ownerId = req.user.id;
    const username = req.body.username;
    await noteService.shareNote(noteId, username, ownerId);

    res.json({ message: 'Note shared successfully' });
  } catch (error) {
    console.error(error);

    if (error.message === 'Note not found' || error.message === 'User not found' || error.message === 'Cannot share a note with yourself') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

// (async () => {
//   try {
//     await esClient.ping();
//     console.log('Elasticsearch is up and running');
//   } catch (err) {
//     console.error('Error pinging Elasticsearch:', err);
//   }
// })();


// createIndex('notes');

async function searchNotes(req, res, next) {
  try {
    const query = req.query.query;
    const ownerId = req.user._id;
    const userNotes = await noteService.searchNotes(query, ownerId);
    res.json(userNotes);
  } catch (error) {
    console.error("Error in searchNotes:", error);

    const errorMessage = error.message || "Internal Server Error";

    res.status(500).json({ error: errorMessage });
  }
}


module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote, shareNote, searchNotes };

