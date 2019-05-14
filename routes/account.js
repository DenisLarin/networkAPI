const router = require('./../config/routerConnection');
const checkToken = require('./../config/jwt');

const jwt = require('jsonwebtoken');
const tokenSecertKey = require('./../config/config').tokenSecretKey;
const email = require('./../config/config').email;

const db_connection = require('./../db/db');
const crypto = require('crypto');

//почта
const nodemailer = require('nodemailer');


const URL = "http://localhost:3000/account/confirmaccount?id=";


router.post('/signup', function (req, res, next) {
    const user = req.body.user;
    user.password = crypto.createHash('sha256').update(user.password).digest('base64');
    user.confirmID = crypto.createHash('sha256').update((user.email).concat(user.phone)).digest('base64');
    db_connection.query('INSERT INTO users SET ?', user, (err, result, fields) => {
        if (err)
            return res.status(406).json({
               error:{
                   errorCodeNumber: err.errno,
                   errorCodeStatus: err.code,
                   errorMessage: err.sqlMessage
               }
            });
        else {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email.email,
                    pass: email.password
                }
            });
            var message = {
                from: email.email,
                to: user.email,
                subject: 'confirm your account',
                html: `<p>press <a href=${URL.concat(user.confirmID)}>here</a> to confirm your account</p><br/>`
            };
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    return res.json({
                        error: err,
                    });
                }
            });
            return res.json({
                status: "account created",
                statusCode: 0,
            });
        }

    });

});

router.post('/signin', function (req, res, next) {
    console.log(req.body);
    const user = req.body.user;
    user.password = crypto.createHash('sha256').update(user.password).digest('base64');

    let sql = "SELECT `userID`,`name`,`surname`,`phone`,`email` FROM users WHERE `phone` = ? and `password` = ?";
    const params = [user.phone, user.password];

    if (user.email) {
        sql = "SELECT `userID`,`name`,`surname`,`phone`,`email` FROM users WHERE `email` = ? and `password` = ?";
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
            if (result.length == 0) {
                return res.status(406).json({
                    error: {
                        errorCodeStatus: "User didn't find",
                        errorCode: -1
                    }
                });
            } else {
                const payload = {
                    userID: result[0].userID,
                    name: result[0].name,
                    surname: result[0].surname,
                    phone: result[0].phone,
                    email: result[0].email
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
                            userID: req.userID
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

router.get('/confirmaccount', (req, res) => {
    const payload = {
        id: req.query.id
    };
    const sql = "Update users set status='activated' where confirmID = ?";
    db_connection.query(sql, payload.id, (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else if (result.changedRows > 0) {
            res.json({
                status: "status changed",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "confirmID was wrong or status have already changed",
                statusCode: -1,
            });
        }
    });
    console.log(req.query);
});

router.post('/checktoken', checkToken,(req, res,) => {
    if (req.userID)
        res.json({
           userID: req.userID
        });
});


module.exports = router;