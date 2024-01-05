//src/services/noteRoutes.js
const express = require('express');
const {
  getNoteById,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
} = require('../controllers/noteController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// Note Routes
router.get('/notes', authenticate, getNotes);
router.get('/notes/:id', authenticate, getNoteById);
router.post('/notes', authenticate, createNote);
router.put('/notes/:id', authenticate, updateNote);
router.delete('/notes/:id', authenticate, deleteNote);
router.post('/notes/:id/share', authenticate, shareNote);
router.get('/search', authenticate, searchNotes);

module.exports = router;
