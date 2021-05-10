const bcrypt = require('bcryptjs');
const formValidation = require('../validation/formValidation');
const passport = require('passport');

const User = require("../models/User");
require("../authentication/passport/local");

module.exports.getUserLogin = (req,res,next)=>{
    res.render("pages/login");
};

module.exports.getUserRegister=(req, res,next) => {
    res.render("pages/register");
};

module.exports.postUserLogin = (req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/",
        failureRedirect:"/login",
        failureFlash:true,
        successFlash:true,
    })(req,res,next);
};

module.exports.postUserRegister =(req, res,next) => {
    const username = req.body.username;
    const password = req.body.password;
    const errors = [];
    const validationErrors = formValidation.registerValidation(username,password);

    // server side validation 
    if(validationErrors.length>0){
        return res.render("pages/register",{
            username:username,
            password:password,
            errors:validationErrors
        });
    }
    User.findOne({
        username
    }).then(user=>{
        if(user){
            errors.push({message:"username already in use"});
            return res.render("pages/register",{
                username,
                password,
                errors
            });
        }
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                if(err) throw err;

                const newUser = new User({
                    username:username,
                    password:hash
                });
                newUser.save()
                    .then(()=>{
                        console.log("user saved");
                        req.flash("flashSuccess","Successfully registered")
                        res.redirect("/")
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            });
        })
    }).catch(err=>console.log(err))

    
};