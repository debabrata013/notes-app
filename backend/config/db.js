const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'notesdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // acquireTimeout: 60000,
    // timeout: 60000
});

// Test connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL Database 🚀');
        connection.release();
    } catch (error) {
        console.error('Error connecting to MySQL: ', error);
        process.exit(1);
    }
};

// Initialize connection test
testConnection();

module.exports = pool;
