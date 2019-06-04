const router = require('./../config/routerConnection');
const DB = require('./../db/db');
const checkToken = require('./../config/jwt');


router.post('/addcommetlike', checkToken, (req, res) => {
    const payload = {
        commentID: req.body.payload.commentID,
        userID: req.userID
    };
    const sql = "insert into commentsLikes set ?";
    db_connection.query(sql, payload, (error, result) => {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                const sql = "update commentsLikes set status='like' where userID=? and commentID=?";
                db_connection.query(sql, [payload.userID, payload.commentID], (error, result) => {
                    if (error) {
                        return res.json({
                            error
                        });
                    }
                    if (result.changedRows > 0)
                        return res.json({
                            status: "like added to comment",
                            statusCode: 0,
                        });
                    else {
                        return res.json({
                            error: {
                                errorCode: -1,
                                errorCodeStatus: "didn't add like"
                            }
                        });
                    }
                });
            } else {
                return res.json({
                    error
                });
            }
        } else {
            return res.json({
                status: "like added to comment",
                statusCode: 0,
            });
        }
    });
});
router.post('/addcommentdislike', checkToken, (req, res) => {
    const payload = {
        commentID: req.body.payload.commentID,
        userID: req.userID
    };
    const sql = "insert into commentsLikes set ?";
    db_connection.query(sql, payload, (error, result) => {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                const sql = "update commentsLikes set status='dislike' where userID=? and commentID=?";
                db_connection.query(sql, [payload.userID, payload.commentID], (error, result) => {
                    if (error) {
                        return res.json({
                            error
                        });
                    }
                    if (result.changedRows > 0)
                        return res.json({
                            status: "dislike added to comment",
                            statusCode: 0,
                        });
                    else {
                        return res.json({
                            error: {
                                errorCode: -1,
                                errorCodeStatus: "didn't add dislike"
                            }
                        });
                    }
                });
            } else {
                return res.json({
                    error
                });
            }
        } else {
            return res.json({
                status: "dislike added to comment",
                statusCode: 0,
            });
        }
    });
});
router.post('/deletecommentlike', checkToken, (req, res) => {
    const commentID = req.body.payload.commentID;
    const userID = req.userID;
    const sql = "delete from commentsLikes where commentID=? and userID =?"
    db_connection.query(sql, [commentID, userID], (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
        if (result.affectedRows > 0)
            return res.json({
                status: "like have been removed",
                statusCode: 0,
            });
        else
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "like didn't find",
                }
            });
    });

});
router.post('/getcommentldl', checkToken, (req, res) => {
    const commentID = req.body.payload.commentID;
    const sql = "select userID, status from commentsLikes where commentID=?";
    db_connection.query(sql, commentID, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        }
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "likes didn't find",
                }
            });
        else
            return res.json({
                likes: result
            });
    });
});


router.post('/addposttlike', checkToken, (req, res) => {
    const payload = {
        postID: req.body.postID,
        userID: req.userID,
        type: 'like'
    };
    const sql = "insert into postsLikes set ?";
    DB.query(sql, payload).then(result => {
        return res.json({
            status: "like added to post",
            statusCode: 0,
        });
    }).catch(error => {
        if (error.code == 'ER_DUP_ENTRY') {
            const sql = "update postsLikes set type='like' where userID=? and postID=?";
            DB.query(sql, [payload.userID, payload.postID]).then(result => {
                if (result.changedRows > 0)
                    return res.json({
                        status: "like added to post",
                        statusCode: 0,
                    });
                else {
                    return res.json({
                        error: {
                            errorCode: -1,
                            errorCodeStatus: "didn't add like"
                        }
                    }).catch(error => {
                        return res.json({
                            error
                        });
                    });
                }
            });
        }
    });
});

router.post('/addpostdislike', checkToken, (req, res) => {
    const payload = {
        postID: req.body.postID,
        userID: req.userID,
        type: 'dislike'
    };
    const sql = "insert into postsLikes set ?";
    DB.query(sql, payload).then(result => {
        return res.json({
            status: "dislike added to post",
            statusCode: 0,
        });
    }).catch(error => {
        if (error.code == 'ER_DUP_ENTRY') {
            const sql = "update postsLikes set type='dislike' where userID=? and postID=?";
            DB.query(sql, [payload.userID, payload.postID]).then(result => {
                if (result.changedRows > 0)
                    return res.json({
                        status: "dislike added to post",
                        statusCode: 0,
                    });
                else {
                    return res.json({
                        error: {
                            errorCode: -1,
                            errorCodeStatus: "didn't add dislike"
                        }
                    }).catch(error => {
                        return res.json({
                            error
                        });
                    });
                }
            });
        }
    });
});

router.post('/deletepostlike', checkToken, (req, res) => {
    const postID = req.body.postID;
    const userID = req.userID;
    const sql = "delete from postsLikes where postID=? and userID =?"
    DB.query(sql,[postID, userID]).then(result=>{
        if (result.affectedRows > 0)
            return res.json({
                status: "like have been removed",
                statusCode: 0,
            });
        else
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "like didn't find",
                }
            });
    }).catch(error=>{
        return res.json({
            error
        });
    });
});
router.post('/getpostldl', checkToken, (req, res) => {
    const postID = req.body.postID;
    const sql = "select `postID`,userID, `type` from postsLikes where postID in (" + postID + ")";
    DB.query(sql, null).then(result => {
        if (result.length == 0)
            return res.json({
                error: {
                    errorCode: -1,
                    errorCodeStatus: "likes didn't find",
                }
            });
        else
            return res.json({
                likes: result
            });
    }).catch(error => {
        return res.json({
            error
        });
    });
});

module.exports = router;