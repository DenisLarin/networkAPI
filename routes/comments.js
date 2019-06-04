const router = require('./../config/routerConnection');
const checkToken = require('./../config/jwt');

const DB = require('./../db/db');

router.post('/sendcomment', checkToken, async (req, res) => {
    const comment = req.body.comment;
    comment.userID = req.userID;
    const sql = "Insert into comments set ?";
    await DB.query(sql, comment).then(result => {
        res.json({
            status: "comment added",
            statusCode: 0,
        });
    }).catch(error => {
        res.json({
            error
        });
    });
});
router.post('/comment/:id', checkToken, (req, res) => {
    const sql = "SELECT * from comments where `commentID`=?";
    DB.query(sql, req.params.id).then(result => {
        if (result.length > 0) {
            return res.json({
                error:{
                    errorCode: -1,
                    errorCodeStatus: "Comment didn't find",
                }
            })
        }
        else return res.json({
            comment:result[0]
        })
    }).catch(error => {
        return res.json({
            error
        });
    });
});
router.post('/comment/edit/:id', checkToken, (req, res) => {
    const payload = {
        comment: req.body.comment.comment,
        commentChangeTime: req.body.comment.commentChangeTime,
        status: 'changed'
    };
    const sql = "UPDATE comments set ? where `commentID`=? and `userID`=?";
    DB.query(sql, [payload, req.params.id, req.userID]).then(result => {
        res.json({
            status: "comment changed",
            statusCode: 0,
        });
    }).catch(err => {
        res.json({
            err
        });
    });
});

router.post('/comment/languageedit/:id', checkToken, (req, res) => {
    const payload = {
        languageChangedComment: req.body.comment.languageChangedComment,
        timeLanguageChanged: new Date(),
        userLanguageChaneID: req.userID,
        status: 'languageChanged'
    };
    ;
    const sql = "UPDATE comments SET ? where `commentID`=?";
    DB.query(sql, [payload, req.params.id]).then(result => {
        if (result.changedRows > 0)
            return res.json({
                status: "comment languagechanged",
                statusCode: 0,
            });
        else
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "comment did'n find or can't change",
                }
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});
router.post('/comment/getshows/:id', checkToken, (req, res) => {
    const sql = "SELECT `commentShow` from comments where `commentID`=?";
    DB.query(sql, req.params.id,).then(result => {
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "comment did'n find",
                }
            });
        else
            return res.json({
                commentShow: result[0].commentShow
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});
router.post('/comment/addshow/:id', checkToken, (req, res) => {
    const sql = "update comments set commentShowCounter=commentShowCounter+1 where commentID=?";
    DB.query(sql, [req.params.id, req.params.id]).then(result => {
        if (result.changedRows > 0)
            return res.json({
                status: "comment shows add one",
                statusCode: 0,
            });
        else
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "comment did'n find",
                }
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});
router.post('/comment/delete/:id', checkToken, (req, res) => {
    const sql = "DELETE from comments where commentID=? and userID=?";
    DB.query(sql, [req.params.id, req.userID]).then(result => {
        if (result.affectedRows == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "comment did'n find",
                }
            });
        else
            return res.json({
                status: "comment deleted",
                statusCode: 0,
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});


module.exports = router;