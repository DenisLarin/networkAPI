const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');

router.post('/sendpost', checkToken, (req, res, next) => {
    const post = req.body.post;
    const token = req.headers.authorization;
    const sql = "INSERT INTO posts SET `postContent`=?, `userID`=(SELECT `userID` from users where `email`=?)";
    db_connection.query(sql, [post.postContent, req.email], (err, value) => {
        if (err) {
            res.json({
                err
            });
        } else {
            res.json({
                status: "post added",
                statusCode: 0,
            });
        }
    });
});

router.post('/post/:id', checkToken, (req, res) => {
    getPost(req.params.id).then((post) => {
        return res.json({
            post,
        });
    }).catch(err => {
        return res.json({
            err
        });
    });
});

function getPost(postID) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM posts where `postID` = ?";
        db_connection.query(sql, postID, (err, result) => {
            if (err)
                return reject({err});
            else {
                if (result.length == 0)
                    return reject({
                        errorCode: -1,
                        errorCodeStatus: "Post didn't find",
                    });
                else {
                    return resolve(result[0]);
                }
            }
        });
    });
}


router.post('/post/edit/:id', checkToken, (req, res) => {
    getPost(req.params.id).then(post => {
        post.postContent = req.body.post.postContent;
        post.postTime = req.body.post.postTime;
        const payload = {
            postContent: post.postContent,
            postTime: post.postTime,
            status: 'changed'
        }
        const sql = "UPDATE posts SET ? where `postID`=?";
        db_connection.query(sql, [payload, post.postID], (err, result) => {
            if (err) {
                res.json({
                    err
                });
            } else {
                res.json({
                    status: "post changed",
                    statusCode: 0,
                });
            }
        })
    }).catch(err => {
        return res.json({
            err
        })
    });
});
router.post('/post/delete/:id', checkToken, (req, res) => {
    const sql = "DELETE from posts where `postID`=?";
    db_connection.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.json({
                err
            });
        } else if(result.affectedRows>0) {
            res.json({
                status: "post deleted",
                statusCode: 0,
            });
        }
        else{
            res.json({
                status: "post didn't find or have already deleted",
                statusCode: -1,
            });
        }
    });
});

router.post('/all',checkToken,(req,res)=>{
   const sql = 'SELECT * FROM posts';
   db_connection.query(sql,null,(err,result)=>{
       if (err) {
           res.json({
               err
           });
       } else {
           res.json({
               post: result
           });
       }
   });
});


module.exports = router;