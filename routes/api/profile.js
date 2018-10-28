const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Profile and User models
const User = require("../../models/User");
const Profile = require("../../models/Profile");
//Profile Validation
const validateProfileInput = require("../../validation/profile");
const validateExpirenceInput = require("../../validation/expirence");
const validateEducationInput = require("../../validation/education");
// @route  GET api/profile/test
// @desc   Tests profile here
// @access public
router.get("/test", (req,res)=>{
    res.json({msg:"profile works"})
});

// @route  GET api/profile
// @desc   Get current user profile here
// @access private

router.get("/",passport.authenticate('jwt',{session: false}),(req,res)=>{
    const errors = {};
    Profile.findOne({user: req.user.id}).then(profile => {
        if(!profile){
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/profile/handle/:handle
// @desc   GET Profile by Handle
// @access public
router.get("/handle/:handle",(req,res)=>{
    const errors ={};
    Profile.findOne({handle:req.params.handle})
    .populate('user', ['name', 'avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile="There is no Profile for this User";
            return res.status(404).json(errors);
            
        }
        res.json(profile)
        
    })
    .catch(err => res.status(404).json({profile:"There is no Profile for this User"}));
});


// @route  GET api/profile/user/:user_id
// @desc   GET Profile by User ID
// @access public
router.get("/user/:user_id",(req,res)=>{
    const errors ={};
    Profile.findOne({user:req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile="There is no Profile for this User";
            return res.status(404).json(errors);
        }
        res.json(profile);
        
    })
    .catch(err => res.status(404).json({profile:"There is no Profile for this User"}));
});

// @route  GET api/profile/all
// @desc   GET All Profiles
// @access public
router.get("/all",(req,res)=>{
    const errors ={};
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles =>{
        if(!profiles){
            errors.noprofile="There are no Profiles";
            return res.status(404).json(errors);
        }
        res.json(profiles);
        
    })
    .catch(err => res.status(404).json({profile:"There are no Profiles"}));
});



// @route  POST api/profile
// @desc   Create or Edit user profile here
// @access private

router.post("/",passport.authenticate('jwt',{session: false}),(req,res)=>{
    const values = validateProfileInput(req.body);
    //Check Validation
    const errors = values.errors;
    const isValid = values.isValid;
    if(!isValid){
        return res.status(400).json(errors);
    }
    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle){
        profileFields.handle = req.body.handle;
    }
    if(req.body.company){
        profileFields.company = req.body.company;
    }
    if(req.body.website){
        profileFields.website = req.body.website;
    }
    if(req.body.location){
        profileFields.location = req.body.location;
    }
    if(req.body.bio){
        profileFields.bio = req.body.bio;
    }
    if(req.body.status){
        profileFields.status = req.body.status;
    }
    if(req.body.githubUsername){
        profileFields.githubUsername = req.body.githubUsername;
    }
    //Skills - Array
    if(typeof req.body.skills !== undefined){
        console.log(req.body.skills);
        profileFields.skills = req.body.skills.split(",");
    }
     profileFields.social ={};
    if(req.body.youtube){
        profileFields.social.youtube = req.body.youtube;
    }
    if(req.body.facebook){
        profileFields.social.facebook = req.body.facebook;
    }
    if(req.body.twitter){
        profileFields.social.twitter = req.body.twitter;
    }
    if(req.body.linkedIn){
        profileFields.social.linkedIn = req.body.linkedIn;
    }
    if(req.body.instagram){
        profileFields.social.instagram = req.body.instagram;
    }
    
    Profile.findOne({user: req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile =>{
           if(profile){
               //update
               Profile.findOneAndUpdate({user: req.user.id},{$set: profileFields},{new:true})
               .then(profile => res.json(profile))
               .catch(err => console.log(err));
           } else{
               //create
               //if Handle Exists
               Profile.findOne({handle: profileFields.handle})
               .then(profile=>{
                   if(profile){
                       errors.handle = "Handle already exists";
                       return res.status(400).json(errors);
                   }
                   
                   //new Profile
                   new Profile(profileFields).save()
                   .then(profile => res.json(profile))
                   .catch(err => console.log(err));
               })
           }
           
        });
});

// @route  POST api/profile/expirence
// @desc  Add Expirence
// @access private
router.post("/expirence",passport.authenticate("jwt",{session:false}),(req,res)=>{
   const values = validateExpirenceInput(req.body);
    //Check Validation
    const errors = values.errors;
    const isValid = values.isValid;
    if(!isValid){
        return res.status(400).json(errors);
    }
   Profile.findOne({user:req.user.id})
   .then(profile =>{
        const newExpirence = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to:req.body.to,
            current: req.body.current,
            description: req.body.description
            
        }; 
        
        //Add to expirence array
        profile.expirence.unshift(newExpirence);
        profile.save().then(profile => res.json(profile));
   });
});

// @route  POST api/profile/expirence
// @desc  Add Expirence
// @access private
router.post("/education",passport.authenticate("jwt",{session:false}),(req,res)=>{
   const values = validateEducationInput(req.body);
    //Check Validation
    const errors = values.errors;
    const isValid = values.isValid;
    if(!isValid){
        return res.status(400).json(errors);
    }
   Profile.findOne({user:req.user.id})
   .then(profile =>{
        const newEducation = {
            school: req.body.school,
            degree: req.body.degree,
            fieldOfStudy: req.body.fieldOfStudy,
            from: req.body.from,
            to:req.body.to,
            current: req.body.current,
            description: req.body.description
            
        }; 
        
        //Add to expirence array
        profile.education.unshift(newEducation);
        profile.save().then(profile => res.json(profile))
        .catch(err =>{
            return res.status(404).json(err);
        });
   });
});

// @route  POST api/profile/expirence/:id
// @desc  Delete Expirence from Profile
// @access private
router.delete("/expirence/:exp_id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    
   Profile.findOne({user:req.user.id})
   .then(profile =>{
        //Get remove index
        const removeIndex = profile.expirence.map(item =>item.id).indexOf(req.params.exp_id);
        //splice array
        profile.expirence.splice(removeIndex,1);
        //save
        profile.save().then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
        
   });
});
// @route  POST api/profile/education/:id
// @desc  Delete Expirence from Profile
// @access private
router.delete("/education/:edu_id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    
   Profile.findOne({user:req.user.id})
   .then(profile =>{
        //Get remove index
        const removeIndex = profile.education.map(item =>item.id).indexOf(req.params.edu_id);
        //splice array
        profile.education.splice(removeIndex,1);
        //save
        profile.save().then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
        
   });
});

// @route  POST api/profile/:id
// @desc  Delete Profile
// @access private
router.delete("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    
   Profile.findOneAndRemove({user:req.user.id}).then(()=>{
       User.findOneAndRemove({_id:req.user.id}).then(()=>{
          res.json({"success":true}); 
       });
   })
   
});

module.exports = router;