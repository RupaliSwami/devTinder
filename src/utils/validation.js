const validator = require('validator');

const validateSignUpData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error('Name is not valid!!');
    }else if(!validator.isEmail(emailId)){
        throw new Error('EmailId is not valid!!')
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Please enter Strong Password!!')
    }
}

const validateEditProfileData = (req) => {

    const allowedEditFields = ["firstName", "lastName", "age", "gender", "photoUrl", "skills"];

    const isEditAllowed = Object.keys(req.body).every(key => allowedEditFields.includes(key));
    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}