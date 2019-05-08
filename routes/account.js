const router = require('./../config/routerConnection');
const checkToken = require('./../config/jwt');

const jwt = require('jsonwebtoken');
const tokenSecertKey = require('./../config/config').tokenSecretKey;

const db_connection = require('./../db/db');
const crypto = require('crypto');


router.post('/signup', function (req, res, next) {
    const user = req.body.user;
    user.password = crypto.createHash('sha256').update(user.password).digest('base64');
    db_connection.query('INSERT INTO users SET ?', user, (err, result, fields) => {
        if (err)
            res.json({
                errorCodeNumber: err.errno,
                errorCodeStatus: err.code,
                errorMessage: err.sqlMessage
            });
        else res.json({
            status: "user added",
            statusCode: 0,
        })
    });

});

router.post('/login', function (req, res, next) {
    const user = req.body.user;
    user.password = crypto.createHash('sha256').update(user.password).digest('base64');

    let sql = "SELECT `name`,`surname`,`phone`,`email` FROM users WHERE `phone` = ? and `password` = ?";
    const params = [user.phone, user.password];

    if (user.email) {
        sql = "SELECT `name`,`surname`,`phone`,`email` FROM users WHERE `email` = ? and `password` = ?";
        params[0] = user.email;
    }

    db_connection.query(sql, params, (err, result, fields) => {
        if (err)
            res.json({
                errorCodeNumber: err.errno,
                errorCodeStatus: err.code,
                errorMessage: err.sqlMessage
            });
        else {
            if (result.length == 0)
                res.json({
                    errorCodeStatus: "User didn't find",
                    errorCode: -1
                });
            else {
                const payload = {
                    name: result[0].name, surname: result[0].surname, phone: result[0].phone, email: result[0].email
                };
                jwt.sign(payload, tokenSecertKey, {
                    audience: "users",
                    issuer: "network",
                    subject: "authorization",
                    expiresIn: "7d"
                }, (err, token) => {
                    if (err)
                        res.json({
                            errorName: err.name,
                            errorMessage: err.message
                        });
                    else
                        res.json({
                            token: token,
                        });
                });
            }
        }
    });
});

router.post('/logout', checkToken, function (req, res, next) {
    res.json({
        status: "successful logout",
        token: null,
        authorization: false
    });
});


module.exports = router;