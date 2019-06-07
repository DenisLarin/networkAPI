const router = require('./../config/routerConnection');
const DB = require('./../db/db');
const checkToken = require('./../config/jwt');



router.post('/users',checkToken, (req,res)=>{
    const searchParams = req.body.searchparams;
    console.log(searchParams);
    const sql = "select * from users where " + searchParams;
    DB.query(sql).then(result=>{
        console.log(result.length);
        if (result.length == 0) {
            return res.status(406).json({
                error: {
                    errorCodeStatus: "User didn't find",
                    errorCode: -1
                }
            });
        } else {
            console.log(1);
            return res.json({
                users: result
            });
        }
    }).catch(error=>{
       return res.status(406).json({
            error:{
                errorCodeNumber: error.errno,
                errorCodeStatus: error.code,
                errorMessage: error.sqlMessage
            }

        });
    });
});

module.exports = router;