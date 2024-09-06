const express = require("express");
const app = express();
const PORT = 8080;
const { initializeTables } = require('./repos/UserRepo');
const UserRoutes = require('./routes/UserRoutes');

app.use( express.json() );

// Use the user routes
app.use('/api', UserRoutes);

// Initialize the database tables
initializeTables();

app.listen(
    PORT,
    () => console.log('its alive on http://localhost:' + PORT.toString())
);