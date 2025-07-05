const { Note } = require('../models/noteModel');
const geminiService = require('../services/geminiService');

// Generate AI Note
const generateAINote = async (req, res) => {
    try {
        const { prompt, noteType = 'general', autoTitle = true } = req.body;

        if (!prompt) {
            return res.status(400).json({ 
                message: 'Prompt is required to generate note' 
            });
        }

        // Generate note content using Gemini
        const aiResult = await geminiService.generateNote(prompt, noteType);

        if (!aiResult.success) {
            return res.status(500).json({ 
                message: 'Failed to generate AI note',
                error: aiResult.error 
            });
        }

        let title = `AI Generated Note - ${noteType}`;
        
        // Auto-generate title if requested
        if (autoTitle) {
            const titleResult = await geminiService.generateTitle(aiResult.content);
            if (titleResult.success) {
                title = titleResult.title;
            }
        }

        // Create and save the note to database
        const newNote = await Note.create({
            userId: req.user.id,
            title: title,
            content: aiResult.content,
            isAIGenerated: true,
            noteType: noteType,
            originalPrompt: prompt
        });

        res.status(201).json({ 
            message: 'AI note generated successfully', 
            note: newNote 
        });

    } catch (error) {
        console.error('Generate AI Note Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Improve Existing Note with AI
const improveNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { improvementType = 'enhance' } = req.body;

        // Find the note
        const note = await Note.findByIdAndUserId(noteId, req.user.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Improve the note using Gemini
        const aiResult = await geminiService.improveNote(note.content, improvementType);

        if (!aiResult.success) {
            return res.status(500).json({ 
                message: 'Failed to improve note',
                error: aiResult.error 
            });
        }

        // Update the note in database
        const updated = await Note.update(noteId, req.user.id, {
            content: aiResult.content,
            improvementType: improvementType
        });

        if (!updated) {
            return res.status(400).json({ message: 'Failed to update note' });
        }

        // Get updated note
        const updatedNote = await Note.findByIdAndUserId(noteId, req.user.id);

        res.json({ 
            message: 'Note improved successfully', 
            note: updatedNote 
        });

    } catch (error) {
        console.error('Improve Note Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Generate Title for Existing Note
const generateTitleForNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        // Find the note
        const note = await Note.findByIdAndUserId(noteId, req.user.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Generate title using Gemini
        const titleResult = await geminiService.generateTitle(note.content);

        if (!titleResult.success) {
            return res.status(500).json({ 
                message: 'Failed to generate title',
                error: titleResult.error 
            });
        }

        // Update the note title in database
        const updated = await Note.updateTitle(noteId, req.user.id, titleResult.title);

        if (!updated) {
            return res.status(400).json({ message: 'Failed to update note title' });
        }

        // Get updated note
        const updatedNote = await Note.findByIdAndUserId(noteId, req.user.id);

        res.json({ 
            message: 'Title generated successfully', 
            note: updatedNote 
        });

    } catch (error) {
        console.error('Generate Title Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Get AI Note Types
const getAINoteTypes = (req, res) => {
    const noteTypes = [
        {
            type: 'general',
            name: 'General Notes',
            description: 'Well-organized general purpose notes'
        },
        {
            type: 'summary',
            name: 'Summary Notes',
            description: 'Structured summaries with key points'
        },
        {
            type: 'study',
            name: 'Study Notes',
            description: 'Comprehensive study materials with definitions and examples'
        },
        {
            type: 'meeting',
            name: 'Meeting Notes',
            description: 'Professional meeting notes with agenda and action items'
        },
        {
            type: 'creative',
            name: 'Creative Notes',
            description: 'Engaging and creative note format'
        }
    ];

    res.json({ noteTypes });
};

module.exports = { 
    generateAINote, 
    improveNote, 
    generateTitleForNote, 
    getAINoteTypes 
};
