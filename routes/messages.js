const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');

// #добавить новое сообщение
// insert into messages set dialogID=3,message='привет',senderID=1
// #изменить сообщение
// update messages set message = 'привет, как дела?' where messageID = 1;
// #удалить сообщения
// delete messages from messages where messageID = 1;
// #вывести все сообщения диалога
// select * from messages where dialogID = 3;
// #вывести сооющения определенного пользователя
// select * from messages where senderID = 1;

router.post('/sendnewmessage', checkToken, (req, res) => {
    const payload = {
        dialogID: req.body.message.dialogID,
        message: req.body.message.message,
        senderID: req.userID,
    };
    const sql = "insert into messages set ?";
    db_connection.query(sql, payload, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
            return res.json({
                status: "message sended",
                statusCode: 0,
            });
        }
    });
});
router.post('/editmessage', checkToken, (req, res) => {
    const payload = {
        message: req.body.message.message,
        messageID: req.body.message.messageID,
        senderID: req.userID
    };
    const sql = "update messages set message = ? where messageID = ? and senderID=?";
    db_connection.query(sql, [payload.message, payload.messageID, payload.senderID], (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else if (result.changedRows > 0) {
            res.json({
                status: "message changed",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "message didn't find or have already changed",
                statusCode: -1,
            });
        }
    });

});
router.post('/deletemessage', checkToken, (req, res) => {
    const payload = {
        messageID: req.body.message.messageID,
    };
    const sql = "delete messages from messages where messageID = ?";
    db_connection.query(sql, payload.messageID, (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else if (result.affectedRows > 0) {
            res.json({
                status: "message deleted from dialog",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "message didn't find or have already deleted",
                statusCode: -1,
            });
        }
    });
});
router.post('/takemessagesofdialog', checkToken, (req, res) => {
    const payload = {
        dialogID: req.body.dialog.dialogID
    };
    const sql = "select * from messages where dialogID = ?";
    db_connection.query(sql, payload.dialogID, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "messages didn't find",
                }
            });
        else
            return res.json({
                messages: result
            });
    });
});
router.post('/takemessagesofuser', checkToken, (req, res) => {
    const payload = {
        senderID: req.body.dialog.senderID
    };
    const sql = "select * from messages where senderID = ?";
    db_connection.query(sql, payload.senderID, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "messages didn't find",
                }
            });
        else
            return res.json({
                messages: result
            });
    });
});


module.exports = router;