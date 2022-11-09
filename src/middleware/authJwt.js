const jwt = require('jsonwebtoken');
const config = require('../config/auth');

verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            message: 'no token provided'
        });
    }

    jwt.verify(token, config.secret, (err, decode) => {
        if (err) {
            return res.status(401).json({
                message: 'unauthorized!'
            })
        }
        req.userId = decode.id
        next()
    })
}

module.exports = {
    verifyToken
}