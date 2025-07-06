const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'notesdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// CORS Setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Enhanced Auth middleware with better error handling
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user still exists in database
        const [users] = await pool.execute('SELECT id, username, email FROM users WHERE id = ?', [decoded.id]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'User no longer exists. Please login again.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token. Please login again.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired. Please login again.' });
        }
        return res.status(500).json({ message: 'Authentication error' });
    }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: result.insertId, username, email }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

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
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Notes Routes
app.get('/api/notes/stats', authenticateToken, async (req, res) => {
    try {
        const [stats] = await pool.execute(`
            SELECT 
                COUNT(*) as totalNotes,
                COUNT(CASE WHEN is_ai_generated = true THEN 1 END) as aiNotes,
                COUNT(CASE WHEN is_favorite = true THEN 1 END) as favoriteNotes,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as weeklyNotes
            FROM notes WHERE user_id = ?
        `, [req.user.id]);

        res.json({
            message: 'Stats retrieved successfully',
            stats: stats[0]
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Failed to get statistics' });
    }
});

app.get('/api/notes', authenticateToken, async (req, res) => {
    try {
        const [notes] = await pool.execute(`
            SELECT id, title, content, category, is_ai_generated, note_type, 
                   is_favorite, created_at, updated_at 
            FROM notes WHERE user_id = ? ORDER BY created_at DESC
        `, [req.user.id]);

        res.json({ notes, count: notes.length });

    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ message: 'Failed to get notes' });
    }
});

app.post('/api/notes', authenticateToken, async (req, res) => {
    try {
        const { title, content, category = 'general' } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const [result] = await pool.execute(`
            INSERT INTO notes (user_id, title, content, category, is_ai_generated, note_type) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [req.user.id, title, content, category, false, 'general']);

        const [newNote] = await pool.execute(`
            SELECT id, title, content, category, is_ai_generated, note_type, 
                   is_favorite, created_at, updated_at 
            FROM notes WHERE id = ?
        `, [result.insertId]);

        res.status(201).json({ 
            message: 'Note created successfully',
            note: newNote[0]
        });

    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ message: 'Failed to create note' });
    }
});

app.get('/api/notes/:noteId', authenticateToken, async (req, res) => {
    try {
        const noteId = parseInt(req.params.noteId);
        const [notes] = await pool.execute(`
            SELECT id, title, content, category, is_ai_generated, note_type, 
                   is_favorite, created_at, updated_at 
            FROM notes WHERE id = ? AND user_id = ?
        `, [noteId, req.user.id]);
        
        if (notes.length === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ note: notes[0] });

    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({ message: 'Failed to get note' });
    }
});

app.put('/api/notes/:noteId', authenticateToken, async (req, res) => {
    try {
        const noteId = parseInt(req.params.noteId);
        const { title, content, category } = req.body;

        const [result] = await pool.execute(`
            UPDATE notes SET title = ?, content = ?, category = ?, updated_at = NOW() 
            WHERE id = ? AND user_id = ?
        `, [title, content, category, noteId, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const [updatedNote] = await pool.execute(`
            SELECT id, title, content, category, is_ai_generated, note_type, 
                   is_favorite, created_at, updated_at 
            FROM notes WHERE id = ?
        `, [noteId]);

        res.json({ 
            message: 'Note updated successfully',
            note: updatedNote[0]
        });

    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ message: 'Failed to update note' });
    }
});

app.delete('/api/notes/:noteId', authenticateToken, async (req, res) => {
    try {
        const noteId = parseInt(req.params.noteId);
        const [result] = await pool.execute('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, req.user.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });

    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ message: 'Failed to delete note' });
    }
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

        // Simulate AI generation (replace with actual Gemini API call)
        const aiContent = `# AI Generated ${noteType.charAt(0).toUpperCase() + noteType.slice(1)} Note

Based on your prompt: "${prompt}"

## Key Points:
• This is an AI-generated note demonstrating the ${noteType} format
• The content would be generated using Google's Gemini API
• This includes structured information relevant to: ${prompt}
• Additional details and explanations would be provided here

## Summary:
This note demonstrates how AI can help create well-structured content based on your specific requirements and note type preferences.

---
*Generated by AI on ${new Date().toLocaleString()}*`;
        
        const title = autoTitle ? `AI: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}` : `AI Generated ${noteType} Note`;

        const [result] = await pool.execute(`
            INSERT INTO notes (user_id, title, content, category, is_ai_generated, note_type, original_prompt) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [req.user.id, title, aiContent, noteType, true, noteType, prompt]);

        const [newNote] = await pool.execute(`
            SELECT id, title, content, category, is_ai_generated, note_type, 
                   is_favorite, created_at, updated_at 
            FROM notes WHERE id = ?
        `, [result.insertId]);

        res.status(201).json({
            message: 'AI note generated successfully',
            note: newNote[0]
        });

    } catch (error) {
        console.error('AI generate error:', error);
        res.status(500).json({ message: 'Failed to generate AI note' });
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
});
