const { promisePool } = require('../config/connection');
const {studentBelongsToParent, getParentByEmail} = require('../db/schema');
const { verifyToken, verifyTokenBelongsToUser, getUserInfoFromToken } = require('./auth');

const verifications = {
    hasAssociation: async function(req, res) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const goodToken = verifyToken(token);
        if(goodToken) {
            const userFromToken = getUserInfoFromToken(token) || null;
            if(userFromToken) {
                const parent = await promisePool.query(getParentByEmail, userFromToken.data.email);
                const parentId = parent[0][0].parentId || "";
                const requestedStudentId = req.params.id;
                const belongsToParent = await promisePool.query(studentBelongsToParent, [requestedStudentId, parentId]);
                const belongsToParentResult = belongsToParent[0][0];
                const belongsToParentValue = belongsToParentResult ? belongsToParentResult.belongsToParent : null;
                if(belongsToParentValue > 0) {
                    return true;
                }
            }
        } else {
            return false;
        }
    }, 
    isLoggedIn: async function(req, res) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1] || null;
        if(!token) {
            return false;
        }
        const goodToken = verifyToken(token) || null;
        const userFromToken = getUserInfoFromToken(token) || null;
        if(goodToken && userFromToken) {
            return true;
        } else {
            return false;
        }
    }
};

module.exports = verifications;

