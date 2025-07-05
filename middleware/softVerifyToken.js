const jwt = require('jsonwebtoken');

// Version of verifyToken that doesnt give an error if user doesnt exist
const softVerifyToken = (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, ((err, authData) => {
        if(err) {
            req.user = null;
            next();
        } else {
            req.user = authData;
            next();
        }
    }));
}

module.exports = softVerifyToken;