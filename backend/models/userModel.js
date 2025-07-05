const db = require('../config/db');

class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Create new user
    static async create(userData) {
        try {
            const { username, email, password } = userData;
            const [result] = await db.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, password]
            );
            return {
                id: result.insertId,
                username,
                email
            };
        } catch (error) {
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT id, username, email, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Check if user exists by email
    static async existsByEmail(email) {
        try {
            const [rows] = await db.execute(
                'SELECT COUNT(*) as count FROM users WHERE email = ?',
                [email]
            );
            return rows[0].count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get all users (admin function)
    static async getAll() {
        try {
            const [rows] = await db.execute(
                'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;