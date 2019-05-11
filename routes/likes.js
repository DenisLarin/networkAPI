const router = require('./../config/routerConnection');
const db_connection = require('./../db/db');
const checkToken = require('./../config/jwt');





router.post('/addcommetdislike',checkToken,(req,res)=>{
    const payload = {
        commentID:req.body.payload.commentID,
        userID: req.userID
    };
   const sql = "insert into commentsDislikes set ?"
});







module.exports = router;