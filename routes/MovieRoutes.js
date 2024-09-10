const express = require('express');
const { authenticateToken } = require('../controllers/UserController');
const { listMovies, addToFav, listFav } = require('../controllers/MovieController');
const router = express.Router();

router.get('/list', authenticateToken, listMovies);
router.post("/fav", authenticateToken, addToFav);
router.get("/fav", authenticateToken, listFav);

module.exports = router;