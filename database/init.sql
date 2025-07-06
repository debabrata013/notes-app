-- Create database if not exists
CREATE DATABASE IF NOT EXISTS notesdb;
USE notesdb;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    is_ai_generated BOOLEAN DEFAULT FALSE,
    note_type VARCHAR(50) DEFAULT 'general',
    original_prompt TEXT NULL,
    improvement_type VARCHAR(50) NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    title_generated BOOLEAN DEFAULT FALSE,
    last_improved TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_ai_generated (is_ai_generated),
    INDEX idx_category (category)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_notes_title ON notes(title);

-- Show tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE notes;
