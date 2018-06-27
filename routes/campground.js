var express     = require("express"),
    router      = express.Router(), 
    Campground  = require("../models/campground"),
    middlewareObj = require("../middleware/index")
    


// INDEX route, displays a list of campgrounds
router.get("/", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});       
       }
    });
     
});

//CREATE route, adds new campground to database
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    //get data from form
    var name = req.body.campGround;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    // add data from form to DB
    var author ={id: req.user._id, username: req.user.username};
    var newEntry = {name: name, image: image, price:price, description: desc, author:author};
    
    Campground.create(newEntry, function(err, campground){
       if(err){
           console.log(err);
       }else{
           console.log(campground)
       } 
    });
    
    //redirect to campgrounds
    res.redirect("/campgrounds");
});

//NEW route displays form to create a new campground
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//SHOW route, shows info about one campground
router.get("/:id", function(req, res) {
    //find the campground with ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
             //render the show template
            res.render("campgrounds/show",{campground: foundCampground}); 
        }
    });
   
});

//EDIT ROUTE
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id,function(err, campground){
      if(err){
          console.log(err);
      } else{
          res.render("campgrounds/edit",{campground:campground});
      }
   }); 
});

//UPDATE route
router.put("/:id", middlewareObj.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds/" + req.params.id );
       }
   }) 
});

//DESTROY route
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndDelete(req.params.id, function(err){
     if(err){
         res.redirect("/campgrounds/" + req.params.id);
     } else{
         res.redirect("/campgrounds");
     }
   });
});




module.exports = router;