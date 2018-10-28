    const Validator = require("validator");
    const isEmpty = require("./is_empty");
    module.exports = function validateExpirenceInput(data){
    const errors = {};
    data.title = !isEmpty(data.title)? data.title: '';
    data.company = !isEmpty(data.company)? data.company: '';
    data.from = !isEmpty(data.from)? data.from: '';
    
    
         
    
     
    if(Validator.isEmpty(data.title)){
            errors.title = "Job Title is required";
        }
    
    if(Validator.isEmpty(data.company)){
            errors.company= "Company is required";
        }
        
    if(Validator.isEmpty(data.from)){
            errors.from = "From Date is required";
        }
    return {
        errors,
        isValid: isEmpty(errors)
        
    }
    }