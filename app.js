const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const layout = require('express-layout');
const app = express();
const methodOverride = require("method-override");
const http = require("http").Server(app);
var io = require("socket.io")(http);

const config = require("./config/secret");


//auth config
const passport = require("passport");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo")(expressSession);
const expressFlash = require("express-flash");
const cookieParser = require("cookie-parser");
//end auth

//mongoose setup
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
    mongoose.connect(config.database, function(err) {
        if(err) {
            console.log(err.message);
        } else {
            console.log("database connected")
        }
    });

//end mongoose setup

//routes
const authRoutes = require("./routes/authRoute");
const homeRoutes = require("./routes/homeRoute");
const infiniteScroll = require("./routes/infiniteScroll");

app.set("view engine", "ejs");
app.use(layout());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('layouts', './views/layouts');
app.set('layout', 'layout');
app.use(methodOverride("_method"));

//sessesion midleware
app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    store: new connectMongo({ url: config.database, autoReconnect: true })
}));
app.use(expressFlash());
////////////////////////passport config/////////////
app.use(cookieParser());
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //for session handling (persistent logins)
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});
//////////////////////////////////////////////////////////

//end session middleware







app.get("/feed", function(req, res){
   res.render("desktop/profileviews/feed", {page: 'The Gird || Myfeed'}); 
});



app.get('/about', function(req, res){
   res.render('desktop/about', {layout: false});
});

require('./socketServer/postSocket')(io);
require('./socketServer/messageSocket')(io);


app.use(homeRoutes);
app.use(authRoutes);
app.use(infiniteScroll);

http.listen(process.env.PORT, process.env.IP, function(){
   console.log("Creative fashion grid conencted successfully"); 
});