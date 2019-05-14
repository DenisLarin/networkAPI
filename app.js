var createError = require('http-errors');
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








// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });


module.exports = app;
