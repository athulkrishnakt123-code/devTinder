const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxLength: 20,
        required: true
    },
    lastName: {
        type: String,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 120
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRt_JtzhU6BiLY_rc1hxdlLoE_Cy8llGKkv-m4zl77LQ&s=10",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL");
            }
        }
    },
    about: {
        type: String,
        default: "This is the user about!!"
    },
    skills: {
        type: [String]
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid..");
            }
        }
    }
},{
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;
    return await jwt.sign({ _id : user._id }, "DEV@TINDER$709", { expiresIn: '15m' });

};

userSchema.methods.validatePassword = async function (passwordInputByUser) {

    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}




const User = mongoose.model('User', userSchema);

module.exports = User;