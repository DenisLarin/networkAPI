const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');

router.post('/sendcomment', checkToken, (req, res) => {
    const comment = req.body.comment;
    comment.userID = req.userID;
    const sql = "Insert into comments set ?";
    db_connection.query(sql, comment, (error, result) => {
        if (error) {
            res.json({
                error
            });
        } else {
            res.json({
                status: "comment added",
                statusCode: 0,
            });
        }
    });
});
router.post('/comment/:id', checkToken, (req, res) => {
    getComment(req.params.id).then(comment => {
        return res.json({
            comment
        });
    }).catch(error => {
        return res.json({
            error
        })
    });
});

getComment = (commentID) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from comments where `commentID`=?";
        db_connection.query(sql, commentID, (err, result) => {
            if (err)
                return reject({err});
            else {
                if (result.length == 0)
                    return reject({
                        errorCode: -1,
                        errorCodeStatus: "Comment didn't find",
                    });
                else {
                    return resolve(result[0]);
                }
            }
        });
    });
};

router.post('/comment/edit/:id', checkToken, (req, res) => {
    const payload = {
        comment: req.body.comment.comment,
        commentChangeTime: req.body.comment.commentChangeTime,
        status: 'changed'
    };
    const sql = "UPDATE comments set ? where `commentID`=? and `userID`=?";
    db_connection.query(sql, [payload, req.params.id, req.userID], (err, result) => {
        if (err) {
            res.json({
                err
            });
        } else {
            res.json({
                status: "comment changed",
                statusCode: 0,
            });
        }
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
    db_connection.query(sql, [payload, req.params.id], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
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
        }
    });
});
router.post('/comment/getshows/:id', checkToken, (req, res) => {
    const sql = "SELECT `commentShow` from comments where `commentID`=?";
    db_connection.query(sql, req.params.id, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else if (result.length == 0)
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
    });
});

function getShows(commentID) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT `commentShow` from comments where `commentID`=?";
        db_connection.query(sql, commentID, (error, result) => {
            if (error)
                return reject(error);
            else if (result.length == 0)
                return reject({errorCode: -1, errorCodeStatus: "comment did'n find"});
            else
                return resolve(result[0].commentShow);
        });
    });
}

/*TODO
*  исправить аналогично update posts set postShowCounter=postShowCounter+1 where postID*/
router.post('/comment/addshow/:id', checkToken, (req, res) => {
    const sql = "update comments as c join (select commentShowCounter from comments where commentID = ?) as scs on c.commentID = ? set c.commentShowCounter = scs.commentShowCounter+1";
    db_connection.query(sql, [req.params.id, req.params.id], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
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
        }
    });
});
router.post('/comment/delete/:id', checkToken, (req, res) => {
    const sql = "DELETE from comments where commentID=? and userID=?";
    db_connection.query(sql, [req.params.id, req.userID], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else if (result.affectedRows == 0)
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
    })
});


module.exports = router;