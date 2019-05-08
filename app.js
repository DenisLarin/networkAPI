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



//роутинг

const account = require('./routes/account');
const posts = require('./routes/posts');
const comments = require('./routes/comments');

app.use('/account', account);
app.use('/posts', posts);
app.use('/comments', comments);






// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });


module.exports = app;
