var express = require('express');
var path = require('path');
var hbs = require("express-handlebars");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var Cart = require('./models/cart');
var csrf = require('csurf');
var compression = require('compression');

var app = express();

require("dotenv").config();
var url=process.env.MONGOLAB_URI;
// connect to db
mongoose.connect(url ||"mongodb://localhost:27017",(err)=>{
    if(err) console.log("not connect to db " +err);
    else console.log("connected to db");
});


// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    httpOnly:true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(function(req, res, next) {
   req.session.cookie.maxAge = 180 * 60 * 1000; // 3 hours
    next();
});
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(function(req, res, next) {
    var carts = new Cart(req.session.cart || {});
    req.session.carts=carts.generateArray();
    res.locals.session = req.session;
    next();
});

/* config csurf */
app.use(csrf({cookie: true}));
app.use(function (req, res, next){
    res.locals._csrf = req.csrfToken();
    next();
}); 

app.use(require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// app.listen(8080,()=>{
//   console.log("server running");
// });

module.exports = app;
