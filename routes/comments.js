const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');

router.post('/sendcomment', checkToken, (req, res) => {
    const comment = req.body.comment;
    comment.userID = req.userID;
    const sql = "Insert into comments set ?";
    db_connection.query(sql, comment, (err, result) => {
        if (err) {
            res.json({
                err
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
    }).catch(err => {
        return res.json({
            err
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
    getComment(req.params.id).then(comment => {
        const payload = {
            comment: req.body.comment.comment,
            commentChangeTime: req.body.comment.commentChangeTime,
            status: 'changed'
        };
        const sql = "UPDATE comments set ? where `commentID`=? and `userID`=?";
        db_connection.query(sql, [payload,req.params.id,req.userID], (err, result) => {
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
    }).catch(err => {
        return res.json({
            err
        })
    });
});


module.exports = router;