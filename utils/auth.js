const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.AUTH_SECRET;
const expiration = '2h';

module.exports = {
    signToken: function ({ firstName, lastName, email}) {
    const payload = {firstName, lastName, email};

    return jwt.sign(
        { data: payload },
        secret,
        { expiresIn: expiration }
    );
    },

    verifyToken: function(token) {
    if(token) {
        const validCheck = jwt.verify(token, secret, {maxAge: expiration});
        if (validCheck !== null && validCheck !== undefined && validCheck !== "")  {
            return validCheck;
        } else {
            return false;
        }
    } else {
        return false;
    }
    },

    getUserInfoFromToken: function(t) {
    const validToken = jwt.verify(t, secret, {maxAge: expiration});
    if(validToken == null || undefined || "") {
        return false;
    }
    const tokenInfo = jwt.decode(t);
    return tokenInfo;
    },

    verifyTokenBelongsToUser: function(t, user) {
    const validToken = jwt.verify(t, secret, {maxAge: expiration});
    if(validToken == null || undefined || "") {
        return false;
    }
    const tokenInfo = jwt.decode(t);
    if(tokenInfo.data && user.email) {
        const tokenEmail = tokenInfo.data.email || 'no token email';
        const userEmail = user.email || 'no user email';
        if(tokenEmail === userEmail) {
        return true;
        } else {
        return false;
        }
    } else {
        return false;
    }
    }
};