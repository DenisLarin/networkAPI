const mysql = require('mysql');
const config = require('./../config/config').db;

const db_connection = mysql.createConnection(config);

db_connection.connect(err=>{
   if (err) throw console.log(err);
   console.log("connect to DB success");
});

module.exports = db_connection;