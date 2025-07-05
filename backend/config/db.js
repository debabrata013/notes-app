const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'notesdb'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = connection;
