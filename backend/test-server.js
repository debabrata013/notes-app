const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Test routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

app.post('/api/auth/register', (req, res) => {
    console.log('Register request:', req.body);
    res.json({ message: 'Register endpoint working', data: req.body });
});

app.post('/api/auth/login', (req, res) => {
    console.log('Login request:', req.body);
    res.json({ message: 'Login endpoint working', data: req.body });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
