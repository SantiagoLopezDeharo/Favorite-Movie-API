const { getUsers, createUser, authRepo } = require('../repos/UserRepo'); // Repo for managing user infomation
const { addToken, tokenInBlackList  } = require("../repos/TokensRepo");  // Repo for managinf invalidated tokens via logout


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
  authRepo(credentials, (err, result, cred) => {
    if (err) return res.status(500);

    if ( ! result ) 
    {
      if (cred == 1)  return res.status(401).send( "Email is not registered." );
      
      return res.status(401).send("Wrong password.");
    }

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

  tokenInBlackList(token, (err, is) => {

    if (err) return res.status(500).send("Internal server error.")

    if ( is ) return res.status(403).send('Invalid token');

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).send('Invalid token');
      req.user = user;
      next();
    });
  })

};

const addUser = (req, res) => {
  const user = req.body;
  
  if (! (user.email && user.firstName && user.lastName && user.password) ) return res.status(403).send("Invalid attributes.");

  if ( user.password.length < 8) return res.status(403).send("Password must be 8 characters long.");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (! emailRegex.test(user.email)) return res.status(403).send("Invalid email.");

  createUser(user, (err, result) => {

      if (err) return res.status(500).send('Internal error trying to create user');
      
      if ( ! result ) res.status(403).send('Email already in use');

      else res.status(200).send('User created');
  });
};

const invalidateToken = (req, res) => {
  const authHeader = req.headers['authorization'];

  if (! authHeader ) return res.status(403).send("Bad request.");

  const token = authHeader.split(' ')[1];

  addToken(token, (err) =>
  {
    if (err) return res.stats(500).send("Internal server error.");

    return res.status(200).json({message:"Token invalidated."})
  })

}

module.exports = { getAllUsers, addUser, auth, authenticateToken, invalidateToken };
