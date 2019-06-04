const router = require('./../config/routerConnection');
const DB = require('./../db/db');
const checkToken = require('./../config/jwt');
router.post('/addpost', checkToken, (req, res, next) => {
    const postContent = req.body.post.postContent;
    const userID = req.userID;
    const wherePageID = req.body.post.wherePageID;

    const sql = "INSERT INTO posts SET `postContent`=?, `userID`=?,wherePageID=?";
    DB.query(sql, [postContent, userID, wherePageID]).then(result => {
        res.json({
            status: "post added",
            statusCode: 0,
        });
    }).catch(err => {
        res.json({
            err
        });
    });
});

router.post('/post/:id', checkToken, (req, res) => {
    sql = "SELECT * FROM posts where `postID` = ?"
    DB.query(sql, req.params.id).then(result => {
        if (result.length == 0)
            return res.json({
                errorCode: -1,
                errorCodeStatus: "Post didn't find",
            });
        else {
            return res.json({post: result[0]});
        }
    }).catch(err => {
        return res.json({
            err
        })
    });

});

router.post('/post/edit/:id', checkToken, (req, res) => {
    const payload = {
        postContent: req.body.post.postContent,
        changedTime: req.body.post.changedTime,
        status: 'changed'
    };
    const userID = req.userID;
    const sql = "UPDATE posts SET ? where `postID`=? and `userID`=?";

    DB.query(sql, [payload, post.postID, userID]).then(result => {

    }).catch(err => {

    });

});
router.post('/post/delete/:id', checkToken, (req, res) => {
    const sql = "DELETE from posts where `postID`=? and `userID`=?";
    const userID = req.userID;
    DB.query(sql, [req.params.id, userID]).then(result => {
        if (result.affectedRows > 0) {
            res.json({
                status: "post deleted",
                statusCode: 0,
            });
        } else {
            res.json({
                status: "post didn't find or have already deleted",
                statusCode: -1,
            });
        }
    }).catch(err => {
        res.json({
            err
        });
    });
});

router.post('/all', checkToken, (req, res) => {
    const sql = 'SELECT * FROM posts';
    return DB.query(sql, null).then(result => {
        res.json({
            post: result
        });
    }).catch(err => {
        res.json({
            err
        });
    });
});

router.post('/post/addshow/:id', checkToken, (req, res) => {
    const sql = "update posts set postShowCounter=postShowCounter+1 where postID = ?";
    db_connection.query(sql, req.params.id, (error, result) => {
        if (error) {
            return res.json({
                error
            });
        } else {
            if (result.changedRows > 0)
                return res.json({
                    status: "post shows add one",
                    statusCode: 0,
                });
            else
                return res.json({
                    error: {
                        errorCode: -1,
                        errorCodeStatus: "post didn't find",
                    }
                });
        }
    });
});


router.post('/getPostsToPage', checkToken, (req, res) => {
    const pageID = req.body.pageID;
    const sql = "select p.postID,\n" +
        "       p.postTime,\n" +
        "       p.postShowCounter,\n" +
        "       p.status,\n" +
        "       p.changedTime,\n" +
        "       p.postContent,\n" +
        "       u.name,\n" +
        "       u.surname,\n" +
        "       u.avatarURL,\n" +
        "       (select count(postsLikes.postID)\n" +
        "        from postsLikes\n" +
        "        where p.postID = postsLikes.postID and postsLikes.type = 'like')    as likes,\n" +
        "       (select count(postsLikes.postID)\n" +
        "        from postsLikes\n" +
        "        where p.postID = postsLikes.postID and postsLikes.type = 'dislike') as dislikes\n" +
        "from posts p\n" +
        "         join users u on p.userID = u.userID\n" +
        "where p.wherePageID = ? order by postTime DESC ;";
    DB.query(sql, pageID).then(result => {
        return res.json({feeds: result});
    }).catch(error => {
        return res.json({error});
    });
});

module.exports = router;