const { promisePool } = require('../config/connection');

const sqlActions = {
    sqlSelectAll: async function(req, res, q) {
        try {
            const [results, fields] = await promisePool.query(q);
            res.json(results);
        } catch(error) {
            console.error('Error Getting Parents: ' , error);
            res.status(500).send(`Server Error: ${error.sqlMessage + " SQL code: " + error.code || error.message || error}`);
        }
    },
    sqlGetOneById: async function(req, res, q) {
        try {
            const requestedId = req.params.id;
            const [results, fields] = await promisePool.query(q, requestedId);
            res.json(results);
        } catch (error) {
            console.error('Error executing query: ' , error);
            res.status(500).send(`Server Error: ${error.sqlMessage + " SQL code: " + error.code || error.message || error}`)
        }
    }, 
    sqlCreateOne: async function(req, res, q, thing) {
        let values = [];
        try {
            switch(thing.toLowerCase()) {
                case "student":
                    const { firstName, lastName, age, parentId } = req.body;
                    if (!firstName || !lastName || !age || !parentId) {
                        return res.status(400).json({ error: 'Missing required fields.' });
                    }
                        values = [firstName, lastName, age, parentId];
                    break;
                case "parent":
                    const { fn, ln, phone, email } = req.body;
                        if (!fn || !ln || !phone || !email) {
                            return res.status(400).json({ error: 'Missing required fields.' });
                        };
                        values = [fn, ln, phone, email];
                    break;
            }
        } catch(err) {
            console.error("Error Adding to DB: " , err);
        }
        try {
            const [result] = await promisePool.query(q, values);
            res.json({ success: true, insertedId: result.insertId });
        } catch (error) {
            console.error('Error creating student:', error);
            res.status(500).send(`Server Error: ${error.sqlMessage + " SQL code: " + error.code || error.message || error}`);
        }
    }
}

module.exports = sqlActions;