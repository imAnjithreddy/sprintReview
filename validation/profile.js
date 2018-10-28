const Validator = require("validator");
const isEmpty = require("./is_empty");
module.exports = function validateProfileInput(data){
    const errors = {};
    data.handle = !isEmpty(data.handle)? data.handle: '';
    data.status = !isEmpty(data.status)? data.status: '';
    data.skills = !isEmpty(data.skills)? data.skills: '';
        
    if(!Validator.isLength(data.handle,{min: 2,max:40})){
        errors.handle = "Handle needs to between 2 and 40 chars";
    }
    if(Validator.isEmpty(data.handle)){
        errors.handle = "Profile Handle is required";
    }
        
    
    if(Validator.isEmpty(data.status)){
        errors.status = "Status Field is required";
    }
    if(Validator.isEmpty(data.skills)){
        errors.skills = "Skills Field is required";
    }
    
    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = "Not a Valid URL";
        }
    }
    
    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.youtube = "Not a Valid URL";
        }
    }
    
    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter = "Not a Valid URL";
        }
    }
    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook = "Not a Valid URL";
        }
    }
    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)){
            errors.instagram = "Not a Valid URL";
        }
    }
    if(!isEmpty(data.linkedIn)){
        if(!Validator.isURL(data.linkedIn)){
            errors.linkedIn = "Not a Valid URL";
        }
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}