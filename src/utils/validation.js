const validator = require('validator');

const validateSignUpData = (req) => {

    const { firstName,lastName,email,password,age } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(age > 120 || age < 18){
        throw new Error("Age is not acceptable");
    }
    else if(firstName.length > 20 || lastName.length > 20){
        throw new Error("Limit Exceed (20 char is limit)");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Invalid EmailId");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter Strong Password");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstname", "lastName", "age", "about", "skills", "photoUrl", "gender"];
    const isEditAllowed = Object.keys(req.body).every(fields => allowedEditFields.includes(fields));
    return isEditAllowed;
}
module.exports = {
    validateSignUpData,
    validateEditProfileData
}