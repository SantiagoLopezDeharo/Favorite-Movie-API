const express = require("express");
const app = express();
const PORT = 8080;

const { initializeUserTable } = require('./repos/UserRepo');
const { initializeMovieTable } = require('./repos/MovieRepo');
const { initializeTokenTable } = require('./repos/TokensRepo');

const UserRoutes = require('./routes/UserRoutes');
const MovieRoutes = require('./routes/MovieRoutes');
app.use( express.json() );

// Use the user routes
app.use('/api', UserRoutes);

// Use the movies routes
app.use('/api/movies', MovieRoutes);

// Initialize the database tables
initializeUserTable();
initializeMovieTable();
initializeTokenTable();

app.listen(
    PORT,
    () => console.log('its alive on http://localhost:' + PORT.toString())
);