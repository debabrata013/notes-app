const express = require('express');
const router = express.Router();
const { 
    generateAINote, 
    improveNote, 
    generateTitleForNote, 
    getAINoteTypes 
} = require('../controllers/aiNotesController');
const authenticateToken = require('../middlewares/authMiddleware');

// AI Note Routes (All Protected)
router.post('/generate', authenticateToken, generateAINote); // Generate AI Note
router.put('/improve/:noteId', authenticateToken, improveNote); // Improve existing note
router.put('/title/:noteId', authenticateToken, generateTitleForNote); // Generate title for note
router.get('/types', authenticateToken, getAINoteTypes); // Get available note types

module.exports = router;
