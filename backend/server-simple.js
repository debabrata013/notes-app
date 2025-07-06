const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS Setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// In-memory storage (for testing)
let users = [];
let notes = [];
let userIdCounter = 1;
let noteIdCounter = 1;

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token missing' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = {
            id: userIdCounter++,
            username,
            email,
            password: hashedPassword,
            created_at: new Date()
        };

        users.push(newUser);

        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: newUser.id, username, email }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Notes Routes
app.get('/api/notes/stats', authenticateToken, (req, res) => {
    const userNotes = notes.filter(note => note.user_id === req.user.id);
    const aiNotes = userNotes.filter(note => note.is_ai_generated);
    const favoriteNotes = userNotes.filter(note => note.is_favorite);
    
    // Notes from this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyNotes = userNotes.filter(note => new Date(note.created_at) >= oneWeekAgo);

    res.json({
        stats: {
            totalNotes: userNotes.length,
            aiNotes: aiNotes.length,
            favoriteNotes: favoriteNotes.length,
            weeklyNotes: weeklyNotes.length
        }
    });
});

app.get('/api/notes', authenticateToken, (req, res) => {
    const userNotes = notes.filter(note => note.user_id === req.user.id);
    res.json({ notes: userNotes, count: userNotes.length });
});

app.post('/api/notes', authenticateToken, (req, res) => {
    try {
        const { title, content, category = 'general' } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const newNote = {
            id: noteIdCounter++,
            user_id: req.user.id,
            title,
            content,
            category,
            is_ai_generated: false,
            is_favorite: false,
            created_at: new Date(),
            updated_at: new Date()
        };

        notes.push(newNote);

        res.status(201).json({ 
            message: 'Note created successfully',
            note: newNote
        });

    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/notes/:noteId', authenticateToken, (req, res) => {
    const noteId = parseInt(req.params.noteId);
    const note = notes.find(n => n.id === noteId && n.user_id === req.user.id);
    
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note });
});

app.put('/api/notes/:noteId', authenticateToken, (req, res) => {
    try {
        const noteId = parseInt(req.params.noteId);
        const { title, content, category } = req.body;

        const noteIndex = notes.findIndex(n => n.id === noteId && n.user_id === req.user.id);
        
        if (noteIndex === -1) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Update note
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title || notes[noteIndex].title,
            content: content || notes[noteIndex].content,
            category: category || notes[noteIndex].category,
            updated_at: new Date()
        };

        res.json({ 
            message: 'Note updated successfully',
            note: notes[noteIndex]
        });

    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/notes/:noteId', authenticateToken, (req, res) => {
    const noteId = parseInt(req.params.noteId);
    const noteIndex = notes.findIndex(n => n.id === noteId && n.user_id === req.user.id);
    
    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }

    notes.splice(noteIndex, 1);
    res.json({ message: 'Note deleted successfully' });
});

// AI Notes Routes
app.get('/api/ai-notes/types', authenticateToken, (req, res) => {
    const noteTypes = [
        { type: 'general', name: 'General Notes', description: 'Well-organized general purpose notes' },
        { type: 'summary', name: 'Summary Notes', description: 'Structured summaries with key points' },
        { type: 'study', name: 'Study Notes', description: 'Comprehensive study materials with definitions' },
        { type: 'meeting', name: 'Meeting Notes', description: 'Professional meeting notes with agenda' },
        { type: 'creative', name: 'Creative Notes', description: 'Engaging and creative note format' }
    ];
    res.json({ noteTypes });
});

app.post('/api/ai-notes/generate', authenticateToken, async (req, res) => {
    try {
        const { prompt, noteType = 'general', autoTitle = true } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        // Simulate AI generation (replace with actual AI service)
        const aiContent = `AI Generated Content based on: "${prompt}"\n\nThis is a ${noteType} note that would be generated by AI. In a real implementation, this would be generated using Google's Gemini API or another AI service.\n\nKey points:\n• Point 1 related to ${prompt}\n• Point 2 with more details\n• Point 3 with conclusions\n\nThis content demonstrates the structure and format that would be created by the AI service.`;
        
        const title = autoTitle ? `AI: ${prompt.substring(0, 50)}...` : `AI Generated Note - ${noteType}`;

        const newNote = {
            id: noteIdCounter++,
            user_id: req.user.id,
            title,
            content: aiContent,
            category: noteType,
            is_ai_generated: true,
            is_favorite: false,
            created_at: new Date(),
            updated_at: new Date()
        };

        notes.push(newNote);

        res.status(201).json({
            message: 'AI note generated successfully',
            note: newNote
        });

    } catch (error) {
        console.error('AI generate error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
