require('dotenv').config();

// Access environment variables
const dbHost = process.env.DB_HOST;
const dbPort = 3306;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// connecting to a database
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});


// Check if the table exists, if not, create it
const initializeTokenTable = () => {
    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS blackListTokens (
            token VARCHAR(255) NOT NULL
        );
    `;
  
    connection.query(createUserTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        console.log('Tokens blacklist table is ready or already exists');
    });
};

// We generate a function for adding tokens to the black list table
const addToken = (token, callback) => {
    const query = "INSERT INTO blackListTokens (token) VALUES (?)";

    connection.query(query, [token], (err) =>
    {
        if (err) return callback(err);

        return callback(null);
    })
};

// We generate a function to know if a token is in the blacklist
const tokenInBlackList = (token, callback) => {
    const query = "SELECT token FROM blackListTokens WHERE token = (?)";

    connection.query(query, [token], (err, results) => 
    {
        if (err) return callback(err, null);

        return callback(null, results.length > 0);
    });
}

module.exports = { initializeTokenTable, addToken, tokenInBlackList };