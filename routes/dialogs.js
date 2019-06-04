const router = require('./../config/routerConnection');
const DB = require('./../db/db');
const checkToken = require('./../config/jwt');


router.post('/createdialog', checkToken, (req, res) => {
    const sql = "insert into dialogs (creationDate, type, name)\n" +
        "values (default,default,default);";
    DB.query(sql, null).then(result => {
        res.json({
            status: "dialog added",
            statusCode: 0,
            insertID: result.insertId,
        });
    }).catch(error => {
        res.json({
            error
        });
    });
});
router.post('/deletedialog', checkToken, (req, res) => {
    const sql = 'delete from dialogs where dialogs.id = ?'
    DB.query(sql, req.body.dialog.id).then(result => {
        if (result.affectedRows > 0) {
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
    }).catch(error => {
        res.json({
            error
        });
    });
});
router.post('/changedialogname', checkToken, (req, res) => {
    const sql = 'update dialogs set name=? where id = ?';

    DB.query(sql, [req.body.dialog.name, req.body.dialog.id]).then(result => {
        if (result.changedRows > 0) {
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
    }).catch(error => {
        res.json({
            error
        });
    });
});


module.exports = router;