const express = require('express');
const authRouter = express.Router()
const {validateSignUpData} = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require("../models/user");
const { userAuth } = require('../middleware/auth');

authRouter.post("/signup", async (req, res) => {
    try{

        //validation
        validateSignUpData(req);

        //password encryption
        const { firstName, lastName, email, password, age, skills, about, photoUrl, gender } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age,
            skills,
            about,
            photoUrl,
            gender
        });

        await user.save();
        res.send("User Saved Successfully");

    }catch(error){
        res.status(404).send("ERROR : " + error.message);
    };
});

authRouter.post("/login", async (req, res) => {
    try{ 
        const { email, password } = req.body;
        const user = await User.findOne({ email : email });
        if(!user){
            throw new Error("Invalid Credential");
        }
        const isPassAllowed = await user.validatePassword(password);
        if(isPassAllowed){
            //create jwt token
            const token = await user.getJWT();

            //add token with cookie and send to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 86400000)});
            res.send("Login SuccessFully");

        }
        else{
            throw new Error("Invalid Credential");
        }
    }catch(error){
        res.status(404).send("ERROR : " + error.message);
    }
});

authRouter.post("/logout", async (req,res) => {
    res.clearCookie("token");
    res.send("logout successfully");
});

module.exports = authRouter;