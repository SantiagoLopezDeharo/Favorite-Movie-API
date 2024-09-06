const { getUsers, createUser, authRepo } = require('../repos/UserRepo');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const secretKey = process.env.JWT_KEY;

const getAllUsers = (req, res) => {
  getUsers((err, users) => {
      if (err) {
          return res.status(500).json({ error: 'Error fetching users' });
      }
      res.json(users);
  });
};

const auth = (req, res) => {
  const credentials = req.body;
  authRepo(credentials, (err, result) => {
    if (err) return res.status(500);

    if ( ! result ) return res.status(401).json( { message : "Wrong credentials." } );

    // Generate token
    let username = credentials.email;
    const token = jwt.sign({ username }, secretKey, { expiresIn: '3h' });

    return res.status(200).json( { auth_token: token } );
  });
}

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).send('Token missing');
  
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

const addUser = (req, res) => {
  const user = req.body;  

  createUser(user, (err, result) => {
      if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Error creating user' });
      }
      res.json({ message: 'User created' });
  });
};

module.exports = { getAllUsers, addUser, auth, authenticateToken };
