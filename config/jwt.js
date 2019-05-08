const jwt = require('jsonwebtoken');
const tokenSecertKey = require('./../config/config').tokenSecretKey;

function checkToken(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, tokenSecertKey, (err, decoded) => {
            if (err) {
                return res.status(400).send({error: err});
            } else {
                req.userID = decoded.userID;
                if (req.userID)
                    next();
                else
                    return res.status(401).send({errorMessage: "your token is not available",errorCodeStatus:"userID is undefined"});
            }
        });
    } else {
        return res.status(401).send({error: 'need authorization'});
    }
}

module.exports = checkToken;