var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user")
    
//landing page route
router.get("/", function(req, res){
   res.render("landing"); 
});


//=============================
//      AUTHENTICATION ROUTES
//=============================

//Show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle user sign up
router.post("/register", function(req, res){
   User.register(new User({username:req.body.username}), req.body.password, function(err,user){
      if(err){
          req.flash("error", err.message);
          return res.redirect("/register");
      } 
      passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to Yelp Camp " +  req.user.username);
          res.redirect("/campgrounds");
      });
   }); 
});

//login form
router.get("/login",function(req, res){
   res.render("login") 
});
//handle user login
router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}),function(req, res){});

//user logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
});



module.exports = router