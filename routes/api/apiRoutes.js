const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/connection');

router.get('/students', async (req, res) => {
    try {
        // Using promisePool for executing queries
        const [results, fields] = await promisePool.query('SELECT * FROM Student');
        res.json(results);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send(`Server Error: ${error.sqlMessage + " SQL code: " + error.code || error.message || error}`);
    }
});

// Additional Routes will go here. 

module.exports = router;