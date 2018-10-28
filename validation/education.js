    const Validator = require("validator");
    const isEmpty = require("./is_empty");
    module.exports = function validateEducationInput(data){
    const errors = {};
    data.school = !isEmpty(data.school)? data.school: '';
    data.degree = !isEmpty(data.degree)? data.degree: '';
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy)?data.fieldOfStudy:'';
    data.from = !isEmpty(data.from)? data.from: '';
    
    
         
    
     
    if(Validator.isEmpty(data.school)){
            errors.school = "Institute of study is required";
        }
    
    if(Validator.isEmpty(data.degree)){
            errors.degree= "Degree is required";
        }
        
    if(Validator.isEmpty(data.from)){
            errors.from = "From Date is required";
        }
    if(Validator.isEmpty(data.fieldOfStudy)){
            errors.fieldOfStudy = "Field of Study is required";
        }
    return {
        errors,
        isValid: isEmpty(errors)
        
    }
    }