const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');


router.post('/addrelative', checkToken, (req, res) => {
    const payload = {
        userID: req.userID,
        userIDrelative: req.body.user.userIDrelative,
        type: req.body.user.type,
    };
    const sql = "Insert into relatives set ?";
    db_connection.query(sql, payload, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
            return res.json({
                status: "relative create",
                statusCode: 0,
            });
        }
    });
});

router.post('/editrelative', checkToken, (req, res) => {
    const payload = {
        type: req.body.user.type,
    };
    const userIDrelative = req.body.user.userIDrelative;
    const sql = "UPDATE relatives set ? where userID=? and userIDrelative=?";
    db_connection.query(sql, [payload, req.userID, userIDrelative], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
            if (result.changedRows > 0)
                return res.json({
                    status: "relative updated",
                    statusCode: 0,
                });
            else
                return res.json({
                    error: {
                        errorCode: -1,
                        errorCodeStatus: "relative didn't find",
                    }
                });
        }
    });
});

router.post('/deleterelative', checkToken, (req, res) => {
    const userIDrelative = req.body.user.userIDrelative;
    const sql = "delete from relatives where userID=? and userIDrelative=?";
    db_connection.query(sql, [req.userID, userIDrelative], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
        if (result.affectedRows > 0)
            return res.json({
                status: "relative have been removed",
                statusCode: 0,
            });
        else
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "relative didn't find",
                }
            });
    });
});

router.post('/acceptrelative', checkToken, (req, res) => {
    const acceptUserID = req.userID;
    const userID = req.body.user.userID;

    const sql = "update relatives set status='accepted' where userIDrelative = ? and userID = ?";
    db_connection.query(sql, [acceptUserID, userID], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
            if (result.changedRows > 0)
                return res.json({
                    status: "status become accepted",
                    statusCode: 0,
                });
            else
                return res.json({
                    error: {
                        errorCode: -1,
                        errorCodeStatus: "relative didn't find",
                    }
                });
        }
    });

});

router.post('/takerelatives', checkToken, (req, res) => {
    const sql = "select userID from relatives where userIDrelative = ? and status='accepted'\n" +
        "union\n" +
        "select userIDrelative from relatives where userID = ? and  status='accepted'";
    db_connection.query(sql, [req.userID, req.userID], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "relatives didn't find",
                }
            });
        else
            return res.json({
                usersIDs: result
            });
    });
});


module.exports = router;