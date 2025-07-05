const jwt = require('jsonwebtoken');

const verifyToken = (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, ((err, authData) => {
        if(err) {
            res.status(403).json({ message: 'Error in verifying JWT token' });
        } else {
            req.authData = authData;
            res.json(authData)
            // next();
        }
    }));
}

module.exports = verifyToken;