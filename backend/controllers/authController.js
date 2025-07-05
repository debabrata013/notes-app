const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory users list (temporary, database baad me add karenge)
let users = [];

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
        id: Date.now(), // Temporary ID
        username,
        email,
        password: hashedPassword
    };

    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username, email } });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
};

module.exports = { registerUser, loginUser };
