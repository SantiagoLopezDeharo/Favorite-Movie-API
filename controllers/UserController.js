const { getUsers, createUser } = require('../repos/UserRepo');

const getAllUsers = (req, res) => {
  getUsers((err, users) => {
      if (err) {
          return res.status(500).json({ error: 'Error fetching users' });
      }
      res.json(users);
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

module.exports = { getAllUsers, addUser };
