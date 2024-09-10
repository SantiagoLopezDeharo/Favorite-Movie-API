const { getUsers, createUser, authRepo } = require('../repos/UserRepo');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const blacklist = new Set(); // This is kept temporarly, meaning that if the server restarts, the still valide tokens will be taken again,
                             // for this reason I will set up a database for this in the future.

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

  if (! authHeader ) return res.status(403).json({message:"Bad request."});

  const token = authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).send('Token missing');

  if ( blacklist.has(token) ) return res.status(403).send('Invalid token');

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
      if ( ! result ) res.json({ message:'Email already in use' });
      else res.json({ message: 'User created' });
  });
};

const invalidateToken = (req, res) => {
  const authHeader = req.headers['authorization'];

  if (! authHeader ) return res.status(403).json({message:"Bad request."});

  const token = authHeader.split(' ')[1];

  blacklist.add(token);

  return res.status(200).json({message:"Token invalidated."})
}

module.exports = { getAllUsers, addUser, auth, authenticateToken, invalidateToken };
