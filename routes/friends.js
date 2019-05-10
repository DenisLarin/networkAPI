const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');


router.post('/sendfiendrequest', checkToken, (req, res) => {
    if (req.userID == req.body.user.recipientUserID) {
        return res.json({
            error: {
                errorCode: -1,
                errorCodeStatus: "you can't add to friend yourself",
            }
        });
    }
    const payLoad = {
        senderUserID: req.userID,
        recipientUserID: req.body.user.recipientUserID
    };
    const sql = "insert into friends set ?";
    db_connection.query(sql, payLoad, (error, result) => {
        if (error) {
            return res.json({
                error: {
                    errorCode: error.code,
                    errno: error.errno,
                    sqlMessage: error.sqlMessage
                }
            });
        } else {
            return res.json({
                status: "request sanded",
                statusCode: 0,
            });
        }
    });
});
router.post('/acceptrequest', checkToken, (req, res) => {
    const payload = {
        status: 'accepted',
        changedStatusTime: new Date()
    };
    const sql = ("UPDATE friends set ? where recipientUserID=? and senderUserID=?");
    db_connection.query(sql, [payload, req.userID, req.body.user.requestUserID], (error, result) => {
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
                        errorCodeStatus: "friend relationships didn't find",
                    }
                });
        }
    });
});
router.post('/cancelrequest', checkToken, (req, res) => {
    const payload = {
        status: 'canceled',
        changedStatusTime: new Date()
    };
    const sql = ("UPDATE friends set ? where recipientUserID=? and senderUserID=?");
    db_connection.query(sql, [payload, req.userID, req.body.user.requestUserID], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
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
        }
    });
});


/*TODO
* поменять на select recipientUserID from friends where senderUserID = 1 and status='sended'
union
select senderUserID from  friends where recipientUserID = 1 and status='sended'
* */
router.post('/takeuserfriends', checkToken, (req, res) => {
    const sql = "select users.userID\n" +
        "from friends\n" +
        "          join users on (users.userID = friends.senderUserID and friends.senderUserID != ?) or\n" +
        "                       ((users.userID = friends.recipientUserID and friends.recipientUserID != ?))\n" +
        "where (senderUserID = ? or recipientUserID = ?)\n" +
        "  and friends.status = 'accepted';"
    db_connection.query(sql, [req.userID, req.userID, req.userID, req.userID], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
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
    });
});
router.post('/takeuserfriendsrequests', checkToken, (req, res) => {
    const sql = "select users.userID\n" +
        "from users\n" +
        "          join friends on friends.recipientUserID = userID and senderUserID = ?\n" +
        "where friends.status = 'sended';"
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
                    errorCodeStatus: "friends didn't find",
                }
            });
        else {
            return res.json({
                usersIDs: result
            });
        }
    });
});
router.post('/takeuserfriendsresponses', checkToken, (req, res) => {
    const sql = "select users.userID\n" +
        "from users\n" +
        "          join friends on friends.senderUserID = userID and recipientUserID = ?\n" +
        "where friends.status = 'sended';"
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
                    errorCodeStatus: "friends didn't find",
                }
            });
        else {
            return res.json({
                usersIDs: result
            });
        }
    });
});


module.exports = router;