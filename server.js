require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

// Import the MySQL connection module
const dbConfig = require('./config/connection');

// Import the routes
const apiRoutes = require('./routes/api/apiRoutes');

app.use(express.json());

// Check the MySQL connection status before starting the server
dbConfig.promisePool.getConnection()
    .then((connection) => {
        console.log("Connected To DB");

        // Release the connection when the server is shut down
        process.on('SIGINT', () => {
            connection.release();
            process.exit();
        });

        // Define health check endpoint
        app.get('/', (req, res) => {
            res.status(200).send("Hello From the My Sparkle Heart API!!!!");
        });

        // Activate the routes
        app.use('/api', apiRoutes);

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to MySQL:', error);
        process.exit(1); // Exit the process if the database connection fails
    });