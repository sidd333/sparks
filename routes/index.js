const router = require("express").Router();
const user = require('../models/User');
const img = require('../models/Image');
var bodyParser = require('body-parser');

router.get("/index", (req, res) => {
   
       
        res.render("index")
   
})

router.get("/",(req, res) => {
    res.render("register")
});

router.get("/profile/:_id",async(req, res) => {
    try{
        const item=  await img.find({"userId":req.params._id})
        const currentUser =  await user.find({"_id":req.params._id}).lean();
        const accountUser =  await user.find({"_id":req.user._id}).lean();
        

        res.render("Profile",{items:item , currentUser:currentUser,accountUser:accountUser})
    }catch(err){
        console.log(err.stack);
    }
    
})


module.exports = router;