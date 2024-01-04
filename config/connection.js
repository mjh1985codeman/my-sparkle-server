require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool using the connection URI
const pool = mysql.createPool({
    connectionLimit: 10, // Adjust the limit based on your requirements
    uri: process.env.DO_URI // Use your connection URI here
});

const promisePool = pool.promise();

// Export the promise pool for use in other modules
module.exports = {
    promisePool
};