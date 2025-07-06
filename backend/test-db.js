const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'notesdb'
        });

        console.log('✅ Database connection successful!');

        // Test tables exist
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));

        // Test users table
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log('👥 Users count:', users[0].count);

        // Test notes table
        const [notes] = await connection.execute('SELECT COUNT(*) as count FROM notes');
        console.log('📝 Notes count:', notes[0].count);

        await connection.end();
        console.log('✅ Database test completed successfully!');

    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        process.exit(1);
    }
}

testDatabase();
