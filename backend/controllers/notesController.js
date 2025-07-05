const { Note } = require('../models/noteModel');

const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({ 
                message: 'Title and content are required' 
            });
        }

        const newNote = await Note.create({
            userId: req.user.id,
            title,
            content,
            isAIGenerated: false,
            noteType: 'general'
        });

        res.status(201).json({ 
            message: 'Note created successfully', 
            note: newNote 
        });

    } catch (error) {
        console.error('Create Note Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Get All Notes of a User
const getUserNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const userNotes = await Note.findByUserId(userId);

        res.json({ 
            notes: userNotes,
            count: userNotes.length 
        });

    } catch (error) {
        console.error('Get User Notes Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Get Single Note
const getSingleNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.user.id;

        const note = await Note.findByIdAndUserId(noteId, userId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ note });

    } catch (error) {
        console.error('Get Single Note Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Update Note
const updateNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.user.id;
        const { title, content } = req.body;

        // Check if note exists
        const existingNote = await Note.findByIdAndUserId(noteId, userId);
        if (!existingNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Update note
        const updated = await Note.update(noteId, userId, { title, content });
        if (!updated) {
            return res.status(400).json({ message: 'Failed to update note' });
        }

        // Get updated note
        const updatedNote = await Note.findByIdAndUserId(noteId, userId);

        res.json({ 
            message: 'Note updated successfully', 
            note: updatedNote 
        });

    } catch (error) {
        console.error('Update Note Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Delete Note
const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.user.id;

        const deleted = await Note.delete(noteId, userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });

    } catch (error) {
        console.error('Delete Note Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Get user notes statistics
const getNotesStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await Note.getStats(userId);

        res.json({ 
            message: 'Notes statistics retrieved successfully',
            stats 
        });

    } catch (error) {
        console.error('Get Notes Stats Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

module.exports = { 
    createNote, 
    getUserNotes, 
    getSingleNote, 
    updateNote, 
    deleteNote, 
    getNotesStats 
};
