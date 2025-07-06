const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'notesdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    charset: 'utf8mb4'
});

// Test connection with retry logic
const testConnection = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('✅ Connected to MySQL Database successfully!');
            connection.release();
            return;
        } catch (error) {
            console.error(`❌ Database connection attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) {
                console.error('💥 Failed to connect to database after all retries');
                process.exit(1);
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

// Initialize connection test
testConnection();

module.exports = pool;
