const jwt = require("jsonwebtoken");
const User =  require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        
        const cookies = req.cookies
        const { token } = cookies;
        if(!token){
            throw new Error("Token is invalid");
        }
        const decodedMessage = await jwt.verify( token, "DEV@TINDER$709");

        const { _id } = decodedMessage;

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User is not Found");
        }
        req.user = user;

        next();

    }catch(error){
        res.status(400).send("ERROR: "+error.message);
    }

};

module.exports = {
    userAuth
}