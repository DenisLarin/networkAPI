const jwt = require('jsonwebtoken');
const DB = require('./../db/db');
const tokenSecertKey = require('./../config/config').tokenSecretKey;

module.exports = (server) => {
    const io = require('socket.io').listen(server);
    io.set('origins', 'localhost:*');

    io.sockets.on('connection', (socket) => {
        socket.on('SINGIN', data => {
            console.log("user login");
            const isOnline = true;
            let userID = null;
            const sql = 'Update users set socketID=?, isOnline=? where userID = ?';
            jwt.verify(data, tokenSecertKey, (err, decoded) => {
                if (err) {
                    return res.status(400).send({error: err});
                } else {
                    userID = decoded.userID;
                }
            });
            DB.query(sql, [socket.id,isOnline,userID]).then(result => {
                socket.emit('SINGIN',isOnline);
            }).catch(err=>{
                console.log(err);
            });


        });
        socket.on('disconnect', (soket) => {
            console.log('user Disconected');
        });
    });
};