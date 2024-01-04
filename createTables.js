require('dotenv').config();
const schemas = require('./db/schema.js');
const { promisePool } = require('./config/connection');

async function createTables() {
    try {
        // Set the transaction isolation level
        await promisePool.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED;');

        console.log('Executing schema queries...');

        for (const query of schemas.createTables) {
            try {
                await promisePool.query(query);
                console.log(`Query executed successfully: ${query}`);
            } catch (error) {
                if (error.code === 'ER_LOCK_DEADLOCK') {
                    console.log(`Deadlock detected. Retrying query: ${query}`);
                    // Add a short delay before retrying
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await promisePool.query(query); // Retry the query
                    console.log(`Query executed successfully after retry: ${query}`);
                } else {
                    console.error(`Error executing query: ${query}`, error);
                }
            }
        }

        console.log('Schema queries executed.');
    } catch (error) {
        console.error('Error setting transaction isolation level:', error);
    }
}

// Call the function
createTables();
