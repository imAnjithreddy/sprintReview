const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const keys = require("../../config/keys");
const gravatar =  require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// @route  GET api/users/test
// @desc   Tests user here
// @access public
router.get("/test", (req,res)=>{
    res.json({msg:"user works"})
});


// @route  GET api/users/register
// @desc   Register user here
// @access public
router.post("/register", (req,res)=>{
    const values = validateRegisterInput(req.body);
    //Check Validation
    const errors = values.errors;
    const isValid = values.isValid;
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                errors.email = "Email already exists"
                return res.status(400).json(errors);    
            }
            else{
                const avatar = gravatar.url(req.body.email,{
                    s: "200",//size
                    r: "pg", //Rating
                    d: "mm", //Default
                    
                });
                const newUser = new User({
                   name: req.body.name,
                   email: req.body.email,
                   avatar,
                   password: req.body.password
                });
                bcrypt.genSalt(10, (err,salt)=>{
                    
                   bcrypt.hash(newUser.password,salt,(err,hash)=>{
                       if(err){
                           throw err;
                       }
                       else{
                           newUser.password = hash;
                           newUser.save()
                           .then(user => res.status(200).json(user))
                           .catch(err => console.log(err));
                       }
                   });
                });
            }
            
            
        });
});

// @route  GET api/users/register
// @desc   Login user here
// @access public

router.post("/login",(req,res)=>{
      const values = validateLoginInput(req.body);
    //Check Validation
    const errors = values.errors;
    const isValid = values.isValid;
    if(!isValid){
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    
    User.findOne({email}).then(
       user =>{
           if(!user){
               errors.email = "User not found";
               return res.status(404).json(errors);
           }
           //Check Password
           bcrypt.compare(password, user.password).then(isMatch => {
              if(isMatch){
                  //res.json({msg:"Success"});
                  //User Matched
                  //payload for jwt
                  const payload = {
                      id: user.id,
                      name: user.name,
                      avatar: user.avatar
                  }
                  //Sign token
                  jwt.sign(payload,keys.SECRETORKEY,{ expiresIn: 3600},(err,token)=>{
                      if(err){
                          console.log(err);
                          return;
                      }
                      res.json({
                         success:"true",
                         token: "Bearer "+token
                      });
                  });
              }
              else{
                  errors.password = "Password incorrect";
                  return res.status(400).json(errors);
              }
           });
       } 
    );
});

// @route  GET api/users/current
// @desc  Return Current User
// @access private

router.get("/current",passport.authenticate("jwt",{session: false}),(req,res)=>{
    res.json({id:req.user.id,name: req.user.name,email:req.user.email});
});


module.exports = router;