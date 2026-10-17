const mongoose = require('mongoose');

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
        unique: true
    },

    age: {
        type: Number,
        required: true,
        min: 18,
        max: 120
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRt_JtzhU6BiLY_rc1hxdlLoE_Cy8llGKkv-m4zl77LQ&s=10"
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

const User = mongoose.model('User', userSchema);

module.exports = User;