const router = require('./../config/routerConnection');
const checkToken = require('./../config/jwt');

const jwt = require('jsonwebtoken');
const DB = require('./../db/db');
const tokenSecertKey = require('./../config/config').tokenSecretKey;
const email = require('./../config/config').email;


const crypto = require('crypto');

//почта
const nodemailer = require('nodemailer');


const URL = "http://localhost:3000/account/confirmaccount?id=";


router.post('/signup', function (req, res, next) {
    const user = req.body.user;
    user.password = crypto.createHash('sha256').update(user.password).digest('base64');
    user.confirmID = crypto.createHash('sha256').update((user.email).concat(user.phone)).digest('base64');
    DB.query('INSERT INTO users SET ?', user).then(result => {
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
    }).catch(error => {
        return res.status(406).json({
            error: {
                errorCodeNumber: error.errno,
                errorCodeStatus: error.code,
                errorMessage: error.sqlMessage
            }
        });
    });
});

router.post('/signin', async function (req, res, next) {
    const user = req.body.user;
    user.password = crypto.createHash('sha256').update(user.password).digest('base64');

    let sql = "SELECT `userID`,`name`,`surname`,`phone`,`email` FROM users WHERE `phone` = ? and `password` = ?";
    const params = [user.phone, user.password];

    if (user.email) {
        sql = "SELECT * FROM users WHERE `email` = ? and `password` = ?";
        params[0] = user.email;
    }
    await DB.query(sql, params).then(result => {
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
                    userID: payload.userID,
                    user: result[0]
                });
        });
    }).catch(err => {
        res.json({
            errorCodeNumber: err.errno,
            errorCodeStatus: err.code,
            errorMessage: err.sqlMessagex
        })
    });
});

router.post('/logout', checkToken, function (req, res, next) {
    res.json({
        status: "successful logout",
        token: null,
        authorization: false
    });
});

router.get('/confirmaccount', async (req, res) => {
    const payload = {
        id: req.query.id
    };
    const sql = "Update users set status='activated' where confirmID = ?";
    await DB.query(sql, payload.id).then(result => {
        if (result.changedRows > 0) {
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
    }).catch(error => {
        res.json({
            error
        });
    });
});
router.post('/checktoken', checkToken, (req, res,) => {
    sql = "SELECT * FROM users WHERE userID = ?";
    DB.query(sql, req.userID).then(result => {
        res.json({
            userID: req.userID,
            user: result[0],
        });
    });
});


module.exports = router;