const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');

//# создание нового диалога
// insert into dialogs (creationDate, type, name)
// values (default,default,default);
// # # удаление диалога
// # delete from dialogs where dialogs.id = 5;
// # # изменение названия диалога
// # update dialogs set name='тестовое имя' where id = 3;

router.post('/createdialog', checkToken, (req, res) => {
    const sql = "insert into dialogs (creationDate, type, name)\n" +
        "values (default,default,default);"
    db_connection.query(sql, null, (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else {
            res.json({
                status: "dialog added",
                statusCode: 0,
                insertID: result.insertId,
            });
        }
    });
});
router.post('/deletedialog', checkToken, (req, res) => {
    const sql = 'delete from dialogs where dialogs.id = ?'
    db_connection.query(sql, req.body.dialog.id, (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else if (result.affectedRows > 0) {
            res.json({
                status: "dialog deleted",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "dialog didn't find or have already deleted",
                statusCode: -1,
            });
        }
    });
});
router.post('/changedialogname', checkToken, (req, res) => {
    const sql = 'update dialogs set name=? where id = ?';
    db_connection.query(sql, [req.body.dialog.name, req.body.dialog.id], (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else if (result.changedRows > 0) {
            res.json({
                status: "dialog name changed",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "dialog name didn't find or have already changed",
                statusCode: -1,
            });
        }
    });
});


module.exports = router;