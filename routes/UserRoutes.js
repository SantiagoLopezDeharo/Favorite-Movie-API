const express = require('express');
const { getAllUsers, addUser } = require('../controllers/UserController');
const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users', addUser);

module.exports = router;