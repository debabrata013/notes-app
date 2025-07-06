const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    console.log('Register request:', req.body);
    res.json({ message: 'Register endpoint working', data: req.body });
});

router.post('/login', (req, res) => {
    console.log('Login request:', req.body);
    res.json({ message: 'Login endpoint working', data: req.body });
});

router.get('/profile', (req, res) => {
    res.json({ message: 'Profile endpoint working' });
});

module.exports = router;
