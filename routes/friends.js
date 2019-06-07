const router = require('./../config/routerConnection');
const DB = require('./../db/db');
const checkToken = require('./../config/jwt');


router.post('/sendfiendrequest', checkToken, (req, res) => {
    if (req.userID == req.body.recipientUserID) {
        return res.json({
            error: {
                errorCode: -1,
                errorCodeStatus: "you can't add to friend yourself",
            }
        });
    }
    const payLoad = {
        senderUserID: req.userID,
        recipientUserID: req.body.recipientUserID
    };
    const sql = "insert into friends set ?";

    DB.query(sql, payLoad).then(result => {
        return res.json({
            status: "request sanded",
            statusCode: 0,
        });
    }).catch(error => {
        return res.json({
            error: {
                errorCode: error.code,
                errno: error.errno,
                sqlMessage: error.sqlMessage
            }
        });
    });

});
router.post('/acceptrequest', checkToken, (req, res) => {
    const payload = {
        status: 'accepted',
        changedStatusTime: new Date()
    };
    const sql = ("UPDATE friends set ? where recipientUserID=? and senderUserID=?");

    DB.query(sql, [payload, req.userID, req.body.requestUserID]).then(result => {
        if (result.changedRows > 0)
            return res.json({
                status: "status become accepted",
                statusCode: 0,
            });
        else
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "friend relationships didn't find",
                }
            });
    }).catch(error => {
        return res.json({
            error: {
                errorCode: error.code,
                errno: error.errno,
                sqlMessage: error.sqlMessage
            }
        });
    });

});
router.post('/cancelrequest', checkToken, (req, res) => {
    const payload = {
        status: 'canceled',
        changedStatusTime: new Date()
    };
    const sql = ("UPDATE friends set ? where recipientUserID=? and senderUserID=?");


    DB.query(sql, [payload, req.userID, req.body.requestUserID]).then(result => {
        if (result.changedRows > 0)
            return res.json({
                status: "status become canceled",
                statusCode: 0,
            });
        else
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "friend relationships didn't find",
                }
            });
    }).catch(error => {
        return res.json({
            error: {
                errorCode: error.code,
                errno: error.errno,
                sqlMessage: error.sqlMessage
            }
        });
    });
});


router.post('/takeuserFriends', checkToken, (req, res) => {
    const payload = {
        userID: req.body.userID,
        status: req.body.status,
    };
    const sql = "select recipientUserID as userID from friends where senderUserID = ? and status = ?\n" +
        "union\n" +
        "select senderUserID as userID from friends where recipientUserID = ? and status=?;";

    DB.query(sql, [payload.userID, payload.status, payload.userID, payload.status]).then(result => {
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "friends didn't find",
                }
            });
        else
            return res.json({
                usersIDs: result
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});
router.post('/takeuserFriendsrequest', checkToken, (req, res) => {
    const payload = {
        userID: req.body.userID,
    };
    const sql = "select senderUserID as userID from friends where recipientUserID = ? and status = 'sended'";

    DB.query(sql, payload.userID).then(result => {
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "friends didn't find",
                }
            });
        else
            return res.json({
                usersIDs: result
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});

router.post('/removeFriend', checkToken, (req, res) => {
    const userID = req.body.userID;
    console.log(userID);
    const sql = "Delete FROM Friends where ((senderUserID = ? and recipientUserID = ?) or (senderUserID = ? and recipientUserID = ?))";
    DB.query(sql, [req.userID, userID, userID, req.userID]).then(result => {
        if (result.affectedRows > 0) {
            res.json({
                status: "friend deleted",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "friend didn't find or have already deleted",
                statusCode: -1,
            });
        }
    }).catch(error => {
        res.json({
            error,
        })
    })
});

router.post('/takeuserFriendsresponse', checkToken, (req, res) => {
    const payload = {
        userID: req.body.userID,
    };
    const sql = "select recipientUserID as userID from friends where senderUserID = ? and status = 'sended'";

    DB.query(sql, payload.userID).then(result => {
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "friends didn't find",
                }
            });
        else
            return res.json({
                usersIDs: result
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});
router.post('/getusers', checkToken, (req, res) => {
    const usersIDs = req.body.usersIDs;
    console.log(usersIDs);
    const sql = "Select * from users where userID in (" + usersIDs + ")";
    DB.query(sql).then(result => {
        if (result.length == 0) {
            return res.status(406).json({
                error: {
                    errorCodeStatus: "User didn't find",
                    errorCode: -1
                }
            });
        } else {
            return res.json({
                user: result
            });
        }
    }).catch(err => {
        res.status(406).json({
            error: {
                errorCodeNumber: err.errno,
                errorCodeStatus: err.code,
                errorMessage: err.sqlMessage
            }

        });
    });
});


module.exports = router;