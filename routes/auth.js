//require express router passport

const router = require("express").Router();
const passport = require("passport");

//require user model
const User = require('../models/User');

//create passport local strategy
passport.use(User.createStrategy());

//serialise and deserailise user
passport.serializeUser(function(user, done) {
    done(null, user._id);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// register user TO THE DATABASE
// METHOD = POST
//accepts form data

router.post("/auth/register", async (req, res) => {
    try {
        const registerUser = await User.register({ username: req.body.username ,img:{
            data:"",
            contentType: 'image/png'
            
        }, bio:""  ,price:0},req.body.password); // register is a passport-local-mongoose feature
        if (registerUser) {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/newsfeed");
            });
        } else {
            res.redirect("register");
        }
    }
    catch (err) {
        res.send(err.stack)
    }
});

//user verification 
//method = post
//accepts form data
router.post("/auth/login", (req, res)=> {
    const user = new User({
        username :req.body.username,
        password :req.body.password,
        following: "",
        followers: "",
        img:{
            data:""
            
        },
        cart:[{}]
        
    });
    req.login(user,(err)=>{
        if(err){
            console.log(err)
        }else{
            passport.authenticate("local")(req,res , function(){
                res.redirect("/newsfeed");
            });
        }
    });
});

//method =get
//redirects to login page

router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/newsfeed')
    } else {
        res.render("login")
    }
})

//method = get
//redirects to register page
router.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/quotes')
    } else {
        res.render("register")
    }
})

//logout
router.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

module.exports = router;