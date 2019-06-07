var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



//роутинг

const account = require('./routes/account');
const posts = require('./routes/posts');
const comments = require('./routes/comments');
const friends = require('./routes/friends');
const relatives = require('./routes/relatives');
const languageStatus = require('./routes/languageStatus');
const likes = require('./routes/likes');
const dialogs = require('./routes/dialogs');
const dialogUsers = require('./routes/dialogUsers');
const messages = require('./routes/messages');
const user = require('./routes/user');
const search = require('./routes/search')

app.use('/account', account);
app.use('/posts', posts);
app.use('/comments', comments);
app.use('/friends', friends);
app.use('/relatives', relatives);
app.use('/languagestatus', languageStatus);
app.use('/likes', likes);
app.use('/dialogs', dialogs);
app.use('/dialogs/dialogusers', dialogUsers);
app.use('/dialogs/messages', messages);
app.use('/user',user);
app.use('/search',search);

var debug = require('debug')('api:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);

const io = require('./socets/index')(server);
app.set('io',io);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

