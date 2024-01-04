const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/connection');

router.get('/parents', async (req, res) => {
    try {
        const [results, fields] = await promisePool.query('SELECT * FROM Parent');
        res.json(results);
    } catch(error) {
        console.error('Error Getting Parents: ' , error);
        res.status(500).send(`Server Error: ${error.sqlMessage + " SQL code: " + error.code || error.message || error}`);
    }
})

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

router.post('/parent', async (req, res) => {
    try {
        const {firstName, lastName, phone, email} = req.body;
        if(!firstName || !lastName || !phone || !email) {
            res.status(400).json({error: 'Missing required fields.'})
        }
        const sql = 'INSERT INTO Parent (firstName, lastName, phone, email) VALUES (?, ?, ?, ?)';
        const values = [firstName, lastName, phone, email];

        const [result] = await promisePool.query(sql, values);
        res.json({ success: true, insertedId: result.insertId });

    } catch(error) {
        console.error('Error creating parent:', error);
        res.status(500).send(`Server Error: ${error.sqlMessage + " SQL code: " + error.code || error.message || error}`);
    }
});

router.post('/student', async (req, res) => {
    try {
        const { firstName, lastName, age, parentId } = req.body;

        if (!firstName || !lastName || !age || !parentId) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const sql = 'INSERT INTO Student (firstName, lastName, age, parentId) VALUES (?, ?, ?, ?)';
        const values = [firstName, lastName, age, parentId];

        const [result] = await promisePool.query(sql, values);

        res.json({ success: true, insertedId: result.insertId });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).send(`Server Error: ${error.sqlMessage + " SQL code: " + error.code || error.message || error}`);
    }
});

module.exports = router;