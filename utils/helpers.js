const { promisePool } = require('../config/connection');
const {studentBelongsToParent, getParentByEmail} = require('../db/schema');
const { signToken, verifyToken, verifyTokenBelongsToUser, getUserInfoFromToken } = require('./auth');

const verifications = {
    hasAssociation: async function(req, res) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const goodToken = verifyToken(token);
        if(goodToken) {
            const userFromToken = getUserInfoFromToken(token);
            if(verifyTokenBelongsToUser(token, userFromToken)) {
                const parent = await promisePool.query(getParentByEmail, userFromToken.data.email);
                const parentId = parent[0][0].parentId || "";
                const requestedStudentId = req.params.id;
                const belongsToParent = await promisePool.query(studentBelongsToParent, [requestedStudentId, parentId]);
                const belongsToParentResult = belongsToParent[0][0];
                const belongsToParentValue = belongsToParentResult ? belongsToParentResult.belongsToParent : null;
                return belongsToParentValue;
            }
        } else {
            return false;
        }
    }
};

module.exports = verifications;

