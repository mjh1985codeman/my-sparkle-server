const { promisePool } = require('../config/connection');
const bcrypt = require('bcryptjs');
const { signToken, verifyToken, verifyTokenBelongsToUser } = require('./auth');

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
                case "parent-registration":
                    const { fn, ln, phone, email, password } = req.body;
                        if (!fn || !ln || !phone || !email || !password) {
                            return res.status(400).json({ error: 'Missing required fields.' });
                        };
                         // Hash the password
                        const hashedPassword = await bcrypt.hash(password, 10);

                        values = [fn, ln, phone, email, hashedPassword];

                        const token = signToken({ email });
                        // Attach the token to the response
                        res.setHeader('x-auth-token', token);
                    
                    break;
                case "service":
                    const { serviceName, description, perSessionPrice, remote, locationName, stAddress, city, state, zip} = req.body;
                    if(!serviceName || !description || !perSessionPrice || !remote || !locationName || !stAddress || !city || !state || !zip) {
                        return res.status(400).json({error: 'Missing required fields.'});
                    };
                    values = [serviceName, description, perSessionPrice, remote, locationName, stAddress, city, state, zip];
                case "enrollment":
                    const { studentId, serviceId} = req.params;
                    if(!studentId || !serviceId) {
                        return res.status(400).json({error: 'Missing required params.'});
                    };
                    values = [studentId, serviceId];
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