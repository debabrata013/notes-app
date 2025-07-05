-- Create Database
CREATE DATABASE IF NOT EXISTS notesdb;

USE notesdb;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
