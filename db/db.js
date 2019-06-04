const mysql = require('mysql');
const config = require('./../config/config').db;

class DB {
    constructor() {
        this.connection = mysql.createPool({
            connectionLimit: 100,
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            debug: false,
            socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
        });
        if (this.connection){
            console.log("connected to DB");
        }
    }

    query = (sql, args) => {
        return new Promise(((resolve, reject) => {
            this.connection.query(sql,args,(err,result)=>{
                if (err)
                    return reject(err);
                resolve(result);
            });
        }));
    };
    close = ()=>{
        return new Promise(((resolve, reject) => {
            this.connection.end(err=>{
                if (err)
                    return reject(err);
                resolve();
            });
        }));
    };
}
module.exports = new DB();