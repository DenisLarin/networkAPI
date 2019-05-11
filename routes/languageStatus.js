const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');


router.post('/addlanguageuserskill', checkToken, (req, res) => {
    const payload = {
        languageID: req.body.languageStatus.languageID,
        userID: req.userID,
        skillID: req.body.languageStatus.skillID
    };
    const sql = "insert into usersLanguageStatus set languageID='Русский',userID=1,skillID='native'";
    db_connection.query(sql, payload, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
            return res.json({
                status: "language status added",
                statusCode: 0,
            });
        }
    });

});
router.post('/deletelanguageuserskill', checkToken, (req, res) => {
    const languageID = req.body.languageStatus.languageID;
    const sql = "DELETE from usersLanguageStatus where userID=? and languageID=?";
    db_connection.query(sql, [req.userID, languageID], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
        if (result.affectedRows > 0)
            return res.json({
                status: "language user status has been deleted",
                statusCode: 0,
            });
        else
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "language user status didn't find",
                }
            });
    });
});
router.post('/editlanguageuserSkill', checkToken, (req, res) => {
    const languageID = req.body.languageStatus.languageID;
    const skillID = req.body.languageStatus.skillID;
    const sql = "update usersLanguageStatus set skillID =? where userID =? and languageID =?";
    db_connection.query(sql, [skillID, req.userID, languageID], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
            if (result.changedRows > 0)
                return res.json({
                    status: "language skill has been changed",
                    statusCode: 0,
                });
            else
                return res.json({
                    error: {
                        errorCode: -1,
                        errorCodeStatus: "language skill has'not been found",
                    }
                });
        }
    });
});
router.post('/takelanguagesuersskill', checkToken, (req, res) => {
    const sql = "select languageID, skillID from usersLanguageStatus where userID=?";
    db_connection.query(sql, req.userID, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "language skill for this user hasn't been found ",
                }
            });
        else
            return res.json({
                result
            });
    });
});


module.exports = router;