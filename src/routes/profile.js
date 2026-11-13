const express = require('express');
const { validateEditProfileData, validatePassword } = require('../utils/validation');
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);

    }catch(error){
        res.status(404).send("ERROR : " + error.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData){
            throw new Error("Edit is not allowed");
        };
        const user = req.user;
        Object.keys(req.body).forEach(keys => user[keys] = req.body[keys]);
        res.json({
            message: `${user.firstName}, your profie is edited successfully`,           
            data: user
        });
    }catch(err){
        res.status(400).send("ERROR "+err.message);
    }

});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try{
        const newPassword = req.body.password;
        validatePassword(newPassword);

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        req.user.password = newPasswordHash
        await req.user.save();
        
        res.json({
            message : `${req.user.firstName},your Password updated successfully`
        })
    }catch(err){
        res.status(400).send(err.message);
    }
})
module.exports = profileRouter;