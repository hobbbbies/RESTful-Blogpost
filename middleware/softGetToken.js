// Version of getToken that doesnt give an error if user doesnt exist
const softGetToken = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== undefined) {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.status(403).json({ message: 'Error in getting JWT token' });
        }
    } catch(error) {
        next();
    }
}

module.exports = softGetToken;