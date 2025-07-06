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

        // Drop existing tables to recreate with correct schema
        console.log('Dropping existing tables...');
        await connection.execute('DROP TABLE IF EXISTS notes');
        await connection.execute('DROP TABLE IF EXISTS users');

        // Create users table
        const createUsersTable = `
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await connection.execute(createUsersTable);
        console.log('Users table created successfully');

        // Create notes table with correct column names
        const createNotesTable = `
            CREATE TABLE notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                category VARCHAR(50) DEFAULT 'general',
                is_ai_generated BOOLEAN DEFAULT FALSE,
                note_type VARCHAR(50) DEFAULT 'general',
                original_prompt TEXT,
                improvement_type VARCHAR(50),
                is_favorite BOOLEAN DEFAULT FALSE,
                title_generated BOOLEAN DEFAULT FALSE,
                last_improved TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at),
                INDEX idx_is_ai_generated (is_ai_generated)
            )
        `;
        
        await connection.execute(createNotesTable);
        console.log('Notes table created successfully');

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
