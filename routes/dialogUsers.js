const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');

//#добавить собеседника в диалог
// insert into dialogUsers set dialogID=4,userID=1;
// #удалить собесединка из диалога
//  delete from dialogUsers where userID=1;
// #вывести пользователей диалога
// select userID from  dialogUsers where dialogID = 3;
// # вывесьи диалоги пользователя
// select dialogID from dialogUsers where userID = 1;
// #изменить роль пользователя в диалоге
// update dialogUsers set role='admin' where dialogID=3 and userID=1;


//TODO check admin
router.post('/addusertodialog', checkToken, (req, res) => {
    const payload = {
        dialogID: req.body.dialog.dialogID,
        userID: req.body.dialogID.userID,
    };

    const sql = "insert into dialogUsers set dialogID=4,userID=1";
    db_connection.query(sql, payload, (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else {
            res.json({
                status: "user added to dialog",
                statusCode: 0,
            });
        }
    });
});
//TODO check admin
router.post('/deleteuserfromdialog', checkToken, (req, res) => {
    const payload = {
        userID: req.body.dialog.userID,
        dialogID: req.body.dialog.dialogID,
    };
    const sql = "delete from dialogUsers where userID=? and dialogID=?";
    db_connection.query(sql, [payload.userID, payload.dialogID], (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else if (result.affectedRows > 0) {
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
    });

});
router.post('/takedialogusers', checkToken, (req, res) => {
    const dialogID = req.body.dialog.dialogID;
    const sql = "select userID from  dialogUsers where dialogID = ?";
    db_connection.query(sql, dialogID, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
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
    });
});
router.post('/takeuserdialogs', checkToken, (req, res) => {
    const userID = req.userID;
    const sql = "select dialogID from  dialogUsers where userID = ?";
    db_connection.query(sql, userID, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
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
    db_connection.query(sql, [payload.role,payload.dialogID, payload.userID], (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else if (result.changedRows > 0) {
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
    db_connection.query(sql, [payload.dialogID, payload.userID1, payload.dialogID, payload.userID2], (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else {
            res.json({
                status: "single dialog created",
                statusCode: 0,
            });
        }
    });
});

router.post('/takeuserdialogswithmessages', checkToken, (req, res) => {
    const sql = "select dialogID\n" +
        "from dialogUsers\n" +
        "where (select count(message) from messages where messages.dialogID = dialogUsers.dialogID) > 0\n" +
        "and userID = ?;"
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
                    errorCodeStatus: "dialogs didn't find",
                }
            });
        else
            return res.json({
                dialogs: result
            });
    });
});

module.exports = router;