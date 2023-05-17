require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");


//routes
const authRoute=require("./routes/auth")
const ecomRoute=require("./routes/ecom")

const quoteRoute = require("./routes/index")
const profileRoute = require("./routes/newsfeed")

//setup application
const app = express();

//setup viewengine ejs ,express-static and body parser

app.set("view engine", "ejs");
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(bodyParser.json());
//setup session

app.use(session({
    secret : process.env.SECRET,
    resave:  false,
    saveUninitialized : false
}))

//initialize passport 

app.use(passport.initialize());

//passport to deal with session
app.use(passport.session());

//database conn
mongoose.connect(process.env.DB_CONNECT)
.then(()=> console.log("database connected"))
.catch(err => console.log(err))


app.get("/uploadEcom", (req,res)=>{
    res.render("uploadEcom")
})

app.get("/register", (req,res)=>{
    res.render("register")
})

app.get("/login", (req,res)=>{
    res.render("login")
})

app.get("/sidebar", (req,res)=>{
    res.render("sidebar")
});


app.get("/EcommB", (req,res)=>{
    res.render("indexEcom")
});

app.get("/cart2", (req,res)=>{
    res.render("cart2")
});  

app.get("/shop", (req,res)=>{
    res.render("shop")
});

app.get("/shop", (req,res)=>{
    res.render("shop")
});

//sproduct
app.get("/sproduct", (req,res)=>{
    res.render("sproduct")
});

//change_password
app.get("/change_password", (req,res)=>{
    res.render("change_password")
});

//blog
app.get("/blog", (req,res)=>{
    res.render("blog")
});

//about
app.get("/about", (req,res)=>{
    res.render("about")
});

app.get("/contact", (req,res)=>{
    res.render("contact")
});

//use routes
app.use("/",authRoute);
app.use("/",ecomRoute);
app.use("/",quoteRoute); //inde
app.use("/",profileRoute) ; //uses newsfeed route









//start server
app.listen(process.env.PORT,()=>console.log("server is running"));








  