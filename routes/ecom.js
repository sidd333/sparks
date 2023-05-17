const router = require("express").Router();
var fs = require('fs'); // file system image storage; multer
const ecom = require('../models/Ecom');
var path = require('path');    //multer
const passport = require("passport"); // user auth 
var bodyParser = require('body-parser');
const user = require('../models/User');



//set up multer for storing uploaded files

var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'ecom')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

router.post('/ecom/uploadpost', upload.array('image', 4), (req, res, next) => {
    const images = req.files

    const img = images.map((item, index) => (

        {
            data: fs.readFileSync(path.join(__dirname, '..', 'ecom', item.filename)),
            contentType: 'image/png'
        }

    ));

    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: img,
        price: req.body.price,
        userId: req.user._id
    }

    ecom.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            item.save();
            res.redirect('/newsfeed');
        }
    });
});


router.get("/ecomProfile/:_id", async (req, res) => {
    try {
        const item = await ecom.find({ "userId": req.params._id })
        const currentUser = await user.find({ "_id": req.params._id }).lean();
        const accountUser = await user.find({ "_id": req.user._id }).lean();


        res.render("ecomProfile", { items: item, currentUser: currentUser, accountUser: accountUser })
    } catch (err) {
        console.log(err.stack);
    }

})


router.post("/addToCart/:_id", async (req, res) => {
    try {
        const currUser = await user.findOne({
            "cart":
            {
                $elemMatch: { item: req.params._id }
            }
        });


        if (currUser) {
            const app = await user.updateOne({ _id: req.user._id, "cart.item": req.params._id }, { $inc: { "cart.$.quantity": 1 } })
        } else {
            const app = await user.updateOne({ "_id": req.user._id }, { $push: { "cart": { item: req.params._id, "quantity": 1 } } })
        }



        res.redirect('back');

    } catch (error) {
        console.log(error.stack)
    }
});

router.post("/removeFromCart/:_id", async (req, res) => {
    try {

        const currentUser = await user.findById(req.user._id);

        const m =  currentUser.cart.map(async (item) => {
            if (item.item == req.params._id && item.quantity < 2) {
                const app = await user.updateOne({ "_id": req.user._id }, { $pull: { "cart": { item: req.params._id } } })
            } else if (item.item == req.params._id && item.quantity > 1) {
      
                const app = await user.updateOne({ _id: req.user._id, "cart.item": req.params._id }, { $inc: { "cart.$.quantity": -1 } })
                
            } else {
                
            }

        })





        res.redirect('back');

    } catch (error) {
        console.log(error.stack)
    }
});


router.get("/cart", async (req, res) => {
    try {
        const currentUser = await user.findById(req.user._id);
        const items = await currentUser.populate({
            path: 'cart.item',
        });

        res.render("cart", { items });

    } catch (error) {
        console.log(error.stack)
    }
});

router.get("/ecom/viewPage/:_id", async (req, res) => {
    try {
        const items = await ecom.find({ _id: req.params._id });

        res.render("viewPage", { items });

    } catch (error) {
        console.log(error.stack)
    }
});



module.exports = router;