const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    let connection;
    
    try {
        // Connect directly to the database
        const dbName = process.env.DB_NAME || 'notesdb';
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: dbName
        });

        console.log(`Connected to MySQL database: ${dbName}`);

        // Create users table
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await connection.execute(createUsersTable);
        console.log('Users table created or already exists');

        // Create notes table
        const createNotesTable = `
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                category VARCHAR(50) DEFAULT 'general',
                tags JSON,
                is_favorite BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        
        await connection.execute(createNotesTable);
        console.log('Notes table created or already exists');

        console.log('Database setup completed successfully! 🎉');

    } catch (error) {
        console.error('Database setup error:', error);
        
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('\n❌ Database does not exist. Please create it manually:');
            console.log(`1. Open MySQL command line or phpMyAdmin`);
            console.log(`2. Run: CREATE DATABASE ${process.env.DB_NAME || 'notesdb'};`);
            console.log(`3. Then run this script again\n`);
        }
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup
setupDatabase();
