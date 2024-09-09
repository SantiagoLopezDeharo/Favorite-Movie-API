const express = require("express");
const app = express();
const PORT = 8080;
const { initializeTables } = require('./repos/UserRepo');
const UserRoutes = require('./routes/UserRoutes');
const MovieRoutes = require('./routes/MovieRoutes');
app.use( express.json() );

// Use the user routes
app.use('/api', UserRoutes);

// Use the movies routes
app.use('/api/movies', MovieRoutes);

// Initialize the database tables
initializeTables();

app.listen(
    PORT,
    () => console.log('its alive on http://localhost:' + PORT.toString())
);