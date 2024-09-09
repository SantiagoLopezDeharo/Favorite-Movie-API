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
const initializeMovieTable = () => {
    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS favMovies (
            movieId INT NOT NULL,
            userId INT NOT NULL
        );
    `;
  
    connection.query(createUserTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        console.log('Favorite Movies table is ready or already exists');
    });
};

const getFavMovies = (usrEmail, callback) => {
    const query = "SELECT movieId FROM favMovies WHERE email = (?)";
    
    connection.query(query, [usrId], (err, results) =>
    {
        if (err) return callback(err, null);

        return callback(null, results);
    });
};

const addFavToUser = (usrEmail, movId, callback) => {
    const query = "INSERT INTO favMovies (movieId, userId) values (?, (SELECT id FROM users WHERE email = ?))";

    connection.query(query, [movId, usrEmail], (err, results) => {
        if (err) return callback(err);

        return callback(null);
    });
};

module.exports = { initializeMovieTable, getFavMovies, addFavToUser };