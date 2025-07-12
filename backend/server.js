// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const authRoutes = require('./routes/auth');
// const notesRoutes = require('./routes/notes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/notes', notesRoutes);

// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const aiNotesRoutes = require('./routes/aiNotes');

const app = express();

// ✅ Correct CORS Setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Add debugging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Add a test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'ai-notes-backend'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai-notes', aiNotesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: err.message 
    });
});

// 404 handler
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
