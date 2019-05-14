const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');

router.post('/getuser', checkToken, (req, res) => {
    const userID = req.userID;

    const sql = "Select name, surname, phone, email, gender, avatarURL, town, country, birthday, status, userDescription from users where userID = ?";
    db_connection.query(sql, userID, (err, result) => {
        if (err)
            res.status(406).json({
                error:{
                    errorCodeNumber: err.errno,
                    errorCodeStatus: err.code,
                    errorMessage: err.sqlMessage
                }

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
                return res.json({
                   user: result[0]
                });
            }
        }
    });
});


module.exports = router;