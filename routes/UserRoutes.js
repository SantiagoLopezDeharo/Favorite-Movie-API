const express = require('express');
const { getAllUsers, addUser, auth, authenticateToken, invalidateToken } = require('../controllers/UserController');
const router = express.Router();

router.get('/users', authenticateToken, getAllUsers);
router.post('/users', addUser);
router.post('/login', auth);
router.delete("/logout", invalidateToken);

module.exports = router;