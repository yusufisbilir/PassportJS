const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const passport = require('passport');

const User = require("./models/User");
const userRouter = require("./routes/users.js");
const app = express();
const port = 3000 || process.env.PORT;



// flash middleware
app.use(cookieParser("passportjs"));
app.use(session({cookie:{maxAge:60000},
resave:true,
secret:"passportjs",
saveUninitialized:true
}));
app.use(flash());

// passport initialize
app.use(passport.initialize());
app.use(passport.session());

// global res.locals middleware
app.use((req,res,next)=>{
  res.locals.flashSuccess = req.flash("flashSuccess");
  res.locals.flashError = req.flash("flashError");

  // passport flash
  res.locals.passportFailure = req.flash("error");
  res.locals.passportSuccess = req.flash("success");

  // logged in user
  res.locals.user = req.user;

  next();
});

//Mongodb connection
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://yusuf:1234@nodejs-blog.691wr.mongodb.net/passportjs?retryWrites=true&w=majority",{
  useNewUrlParser:true,
  useUnifiedTopology:true
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
  console.log("connected db");
});

// body parser
app.use(bodyParser.urlencoded({extended:false}));

// router middleware
app.use(userRouter);

// setting view engine
app.engine('handlebars',hbs({'defaultLayout':'mainlayout'}));
app.set("view engine","handlebars");


app.get('/', (req, res) => {
  User.find({}).lean()
    .then(users=>{
      res.render("pages/index",{users});
    }).catch(err=>console.log(err))
});

app.use(function (req, res, next) {
  res.status(404).render("static/404");
});

app.listen(port, _ =>{console.log("running port 3000")});