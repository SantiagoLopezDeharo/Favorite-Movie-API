const express = require('express');
const { authenticateToken } = require('../controllers/UserController');
const { listMovies } = require('../controllers/MovieController');
const router = express.Router();

router.get('/movies', authenticateToken, listMovies);


module.exports = router;