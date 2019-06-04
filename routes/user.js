const router = require('./../config/routerConnection');
const DB = require('./../db/db');
const checkToken = require('./../config/jwt');

router.post('/getuser', checkToken, (req, res) => {
    const userID = req.body.userID;
    const sql = "Select name, surname, phone, email, gender, avatarURL, town, country, birthday, status, userDescription from users where userID = ?";
    DB.query(sql,userID).then(result=>{
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
    }).catch(err=>{
        res.status(406).json({
            error:{
                errorCodeNumber: err.errno,
                errorCodeStatus: err.code,
                errorMessage: err.sqlMessage
            }

        });
    });
});


module.exports = router;