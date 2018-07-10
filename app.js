var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
flash       = require("connect-flash"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
User        = require("./models/user"),
methodOverride = require("method-override"),
passport    = require("passport"),
LocalStrategy= require("passport-local"),
LocalMongoose = require("passport-local-mongoose"),
seedDB      = require("./seeds");

var commentRoutes       = require("./routes/comment"),
    campgroundRoutes    = require("./routes/campground"),
    indexRoutes         = require("./routes/index")
        
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://harrup:harrupsingh1@ds233551.mlab.com:33551/campwebsite");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//seedDB(); //seeds the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"rusty is the best dog in the world",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//Requiring routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("yelp camp server has started"); 
});