const router = require('./../config/routerConnection');
const DB = require('./../db/db');
const checkToken = require('./../config/jwt');


//TODO check admin
router.post('/addusertodialog', checkToken, (req, res) => {
    const payload = {
        dialogID: req.body.dialog.dialogID,
        userID: req.body.dialogID.userID,
    };

    const sql = "insert into dialogUsers set dialogID=?,userID=?";

    DB.query(sql, payload).then(result => {
        res.json({
            status: "user added to dialog",
            statusCode: 0,
        });
    }).catch(error => {
        res.json({
            error
        });
    });
});

//TODO check admin
router.post('/deleteuserfromdialog', checkToken, (req, res) => {
    const payload = {
        userID: req.body.dialog.userID,
        dialogID: req.body.dialog.dialogID,
    };
    const sql = "delete from dialogUsers where userID=? and dialogID=?";

    DB.query(sql, [payload.userID, payload.dialogID]).then(result => {
        if (result.affectedRows > 0) {
            res.json({
                status: "user deleted from dialog",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "user didn't find or have already deleted",
                statusCode: -1,
            });
        }
    }).catch(error => {
        res.json({
            error
        });
    });


});
router.post('/takedialogusers', checkToken, (req, res) => {
    const dialogID = req.body.dialog.dialogID;
    const sql = "select userID from  dialogUsers where dialogID = ?";


    DB.query(sql, dialogID).then(result => {
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "users didn't find",
                }
            });
        else
            return res.json({
                users: result
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});

router.post('/takeuserdialogs', checkToken, (req, res) => {
    const userID = req.userID;
    const sql = "select dialogID from  dialogUsers where userID = ?";

    DB.query(sql, userID).then(result => {
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "dialogs didn't find",
                }
            });
        else
            return res.json({
                dialogs: result
            });
    }).catch(error => {
        return res.json({
            error
        });
    });

});
//TODO проверка на админа
router.post('/changeuserrole', checkToken, (req, res) => {
    const payload = {
        dialogID: req.body.dialog.dialogID,
        userID: req.body.dialog.userID,
        role: req.body.dialog.role
    };
    const sql = "update dialogUsers set role=? where dialogID=? and userID=?";

    DB.query(sql, [payload.role, payload.dialogID, payload.userID]).then(result => {
        if (result.changedRows > 0) {
            res.json({
                status: "user status changed",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "user didn't find or have already changed",
                statusCode: -1,
            });
        }
    }).catch(error => {
        return res.json({
            error
        });
    });

});


//TODO провека на наличие диалога
router.post('/adduserstosingledialog', checkToken, (req, res) => {
    const payload = {
        dialogID: req.body.dialog.dialogID,
        userID1: req.userID,
        userID2: req.body.dialog.userID,
    };
    const sql = "INSERT INTO dialogUsers(dialogID,userID) VALUES(?,?),(?,?)";


    DB.query(sql, [payload.dialogID, payload.userID1, payload.dialogID, payload.userID2]).then(result => {
        res.json({
            status: "single dialog created",
            statusCode: 0,
        });
    }).catch(error => {
        return res.json({
            error
        });
    });
});

router.post('/takeuserdialogswithmessages', checkToken, (req, res) => {
    const sql = "select dialogID\n" +
        "from dialogUsers\n" +
        "where (select count(message) from messages where messages.dialogID = dialogUsers.dialogID) > 0\n" +
        "and userID = ?;"
    DB.query(sql, req.userID).then(result => {
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "dialogs didn't find",
                }
            });
        else
            return res.json({
                dialogs: result
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});

module.exports = router;