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
                        try {
                            const [result] = await promisePool.query(q, values);
                            res.json({ success: true, insertedId: result.insertId });
                        } catch (error) {
                            console.error('Error with Regisration:', error);
                            res.status(500).send(`Server Error: ${error.sqlMessage || error.message || error}`);
                        }
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
                case "login":
                    const {em, pw} = req.body;

                    try {
                    const parent = await promisePool.query(q, em);
                    //check if parent exists: 
                    if(!parent) {
                        return res.status(401).json({error: 'No User Found w/ Email'});
                    };
                    const isValidPW = await bcrypt.compare(pw, parent[0][0].password);
                    if(!isValidPW) {
                        return res.status(401).json({error: 'Invalid Credentials'});
                    }

                    //userAuthenticated: 
                    if(isValidPW) {
                        try {
                            const {firstName, lastName, email} = parent[0];
                            const token = signToken({firstName: firstName, lastName: lastName, email: email});
                            res.json({token});
                        } catch (err) {
                            res.status(500).json({error: `Error issuing Token for Login: ${err}`});
                        }
                    }
                    } catch(err) {
                        res.status(500).json({error: `Error processing request: ${err}`});
                    }
            }
        } catch(err) {
            console.error("Error Processing Request with DB: " , err);
        }
    }
}

module.exports = sqlActions;