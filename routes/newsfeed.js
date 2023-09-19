const router = require("express").Router();
var fs = require("fs"); // file system image storage; multer
var imgModel = require("../models/Image");
var path = require("path"); //multer
const passport = require("passport"); // user auth
var bodyParser = require("body-parser");
const user = require("../models/User");
router.use(bodyParser.json());

//set up multer for storing uploaded files

var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

//method =get
//redirect to news feed
router.get("/newsfeed", async (req, res) => {
  //todo:make items have only the images of those u follow
  //

  try {
    if (req.isAuthenticated()) {
      const currentUser = await user.findById(req.user._id);
      const following = currentUser.following; //returns an array with object id of following
      const items = await imgModel
        .find({ userId: following })
        .populate("userId")
        .sort({ createdAt: -1 });

      const getfollowingdetails = await currentUser.populate({
        path: "following",
      });
      const first5 = getfollowingdetails.following.slice(0, 5);

      // const items2 = await imgModel.find({ userId: following }).populate('userId');

      res.render("newsfeed", {
        items: items,
        user: currentUser,
        first5: first5,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.stack);
  } // userId: req.user._id
});

router.get("/upload", async (req, res) => {
  try {
    if (req.isAuthenticated()) res.render("Upload");
    else res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

//the POST handler for processing the uploaded file

router.post("/uploadpost", upload.single("image"), (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname, "..", "uploads", req.file.filename)
      ),
      contentType: "image/png",
    },
    userId: req.user._id,
  };

  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      item.save();
      res.redirect("/newsfeed");
    }
  });
});

router.post("/uploadprofile", upload.single("img"), (req, res, next) => {
  const obj = {
    bio: req.body.bio,
  };
  if (req.file && req.file.filename)
    obj.img = {
      data: fs.readFileSync(
        path.join(__dirname, "..", "uploads", req.file.filename)
      ),
      contentType: "image/png",
    };
  const currentUser = user.findById(req.user._id);
  currentUser.updateMany(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/newsfeed");
    }
  });
});

router.post("/newsfeed/follow/:_id", async (req, res) => {
  try {
    //:_id is the user who posted
    const personToBeFollowed = await user.findById(req.params._id);
    const currentUser = await user.findById(req.user._id);

    if (personToBeFollowed.followers.includes(req.user._id)) {
      const apply = await personToBeFollowed.updateOne({
        $pull: { followers: req.user._id },
      });
      const follow = await currentUser.updateOne({
        $pull: { following: req.params._id },
      });
      // TODO : ONE MORE UPDATE FUCTION ,CREATE ANOTHER KEY FOR FOLLOWERS AND PUT ITS UPDATE FUNCTION HERE
    } else {
      const follow = await currentUser.updateOne({
        $push: { following: req.params._id },
      });
      const apply = await personToBeFollowed.updateOne({
        $push: { followers: req.user._id },
      });

      // TODO : ONE MORE UPDATE FUCTION ,CREATE ANOTHER KEY FOR FOLLOWERS AND PUT ITS UPDATE FUNCTION HERE
    }

    res.redirect("/newsfeed");
  } catch (err) {
    console.log("error");
  }
});

router.post("/newsfeed/search", async (req, res) => {
  try {
    const currentUser = await user.findById(req.user._id);
    const nameSim = req.body.name.trim().substring(0, 3);
    const secUsers = await user.find({
      username: new RegExp(".*" + nameSim + ".*", "i"),
    });

    res.render("searchresults", { items2: secUsers, user: currentUser });
  } catch (err) {
    console.log("error");
  }
});

router.post("/like/:_id", async (req, res) => {
  try {
    if (await req.isAuthenticated()) {
      //find the post to update Likes
      const post = await imgModel.findById(req.params._id);
      //check if youve already liked the pic or not
      // if post.likedby has current user
      if (post.likedby.includes(req.user._id)) {
        const updateLikes = await post.updateOne({ likes: post.likes - 1 });
        const updateL = await imgModel.updateOne(
          { _id: req.params._id },
          { $pull: { likedby: req.user._id } }
        );
      } else {
        const updateLikes = await post.updateOne({ likes: post.likes + 1 });
        const updateL = await imgModel.updateOne(
          { _id: req.params._id },
          { $push: { likedby: req.user._id } }
        );
      }

      //redirect to quotes page
      res.redirect("/newsfeed");
    } else res.redirect("/login");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
