const express = require('express');
const router = express.Router();
const { createNote, getUserNotes, getSingleNote, updateNote, deleteNote } = require('../controllers/notesController');
const authenticateToken = require('../middlewares/authMiddleware');

// CRUD Routes (Protected)
router.post('/', authenticateToken, createNote); // Create Note
router.get('/', authenticateToken, getUserNotes); // Get All Notes for Logged-in User
router.get('/:noteId', authenticateToken, getSingleNote); // Get Single Note
router.put('/:noteId', authenticateToken, updateNote); // Update Note
router.delete('/:noteId', authenticateToken, deleteNote); // Delete Note

module.exports = router;
