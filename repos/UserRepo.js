require('dotenv').config();

const bcrypt = require('bcrypt');

// Define the number of salt rounds (higher is more secure, but slower)
const saltRounds = 10;


async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);  // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password with the salt
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
}

// Compare a password with a hashed password
const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match; // returns true if passwords match, false otherwise
  } catch (error) {
    console.error('Error comparing passwords:', error);
  }
};


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
const initializeUserTable = () => {
  const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          firstName VARCHAR(255) NOT NULL,
          lastName VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `;

  connection.query(createUserTableQuery, (err, results) => {
      if (err) {
          console.error('Error creating users table:', err);
          return;
      }
      console.log('Users table is ready or already exists');
  });
};

// Function to create a user
const createUser = async (user, callback) =>  {
  connection.query('SELECT * FROM users WHERE email = (?)', [user.email], async (err, results) => {
    if (err) return callback(err, null);
    
    let cant = results.length;
    if (cant > 0) return callback(null, false);

    let hashed = await hashPassword( user.password );
    const query = 'INSERT INTO users (email, firstName, lastName, password) VALUES (?, ?, ?, ?)';
    const values = [user.email, user.firstName, user.lastName, hashed];

    connection.query(query, values, (err, results) => {
      if (err) return callback(err, null);
      
      return callback(null, true);
  });
  });  
};

// Function to get all users from the database
const getUsers = (callback) => {
  connection.query('SELECT email, firstName, lastName FROM users', (err, results) => {
      if (err) return callback(err, null);
      
      return callback(null, results);
  });
};

const authRepo = async (credential, callback) => {
  connection.query('SELECT password FROM users WHERE email = (?)', [credential.email], async (err, results) => {
    if (err) return callback(err, null);
    
    // Check if user exists
    if (results.length === 0) return callback(null, false);
    const hashedPassword = results[0].password;
    try 
    {
        await comparePasswords(credential.password, hashedPassword).then(isMatch => {
          return callback(null, isMatch);
        });
    }
    catch (error) {
      callback(error, null);
    }
    
});
}

// Export the initialization function and user methods
module.exports = { initializeUserTable, getUsers, createUser, authRepo };