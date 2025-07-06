const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        console.log('Register request received:', req.body);
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            console.log('Validation failed: Missing required fields');
            return res.status(400).json({ 
                message: 'Username, email, and password are required' 
            });
        }

        // Check if user already exists
        console.log('Checking if user exists with email:', email);
        const existingUser = await User.existsByEmail(email);
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        console.log('Creating new user...');
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        console.log('User created successfully:', newUser);
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Register User Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                username: user.username 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login User Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
