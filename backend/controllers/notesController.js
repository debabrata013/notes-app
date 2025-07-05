const { Note, notes } = require('../models/noteModel');

const createNote = (req, res) => {
    const { title, content } = req.body;

    const newNote = {
        id: Date.now(),
        userId: req.user.id, // User from token
        title,
        content
    };

    notes.push(newNote);

    res.status(201).json({ message: 'Note created successfully', note: newNote });
};
// ➜ Get All Notes of a User
const getUserNotes = (req, res) => {
    const userId = req.user.id;

    const userNotes = notes.filter(note => note.userId == userId);

    res.json({ notes: userNotes });
};

// ➜ Get Single Note
const getSingleNote = (req, res) => {
    const noteId = req.params.noteId;

    const note = notes.find(n => n.id == noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.json({ note });
};

// ➜ Update Note
const updateNote = (req, res) => {
    const noteId = req.params.noteId;
    const { title, content } = req.body;

    const note = notes.find(n => n.id == noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = title || note.title;
    note.content = content || note.content;

    res.json({ message: 'Note updated successfully', note });
};

// ➜ Delete Note
const deleteNote = (req, res) => {
    const noteId = req.params.noteId;

    const index = notes.findIndex(n => n.id == noteId);
    if (index === -1) return res.status(404).json({ message: 'Note not found' });

    notes.splice(index, 1);

    res.json({ message: 'Note deleted successfully' });
};

module.exports = { createNote, getUserNotes, getSingleNote, updateNote, deleteNote };
