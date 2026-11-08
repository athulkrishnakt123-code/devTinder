const express = require('express');
const ConnenctionRequest = require('../models/connectionRequest');
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require('../models/user');

requestRouter.post("/sendConnectionRequest/:status/:userId", userAuth, async(req, res) => {
    try{

       const fromUserId = req.user._id;
       const toUserId = req.params.userId;
       const status = req.params.status;

       const allowedStatus = ["interested", "ignored"];

        if(!allowedStatus.includes(status)){
            throw new Error("Invalid Status Type");
        };
       const toUser = await User.findById(toUserId);
       
       if(!toUser){
            throw new Error("User is not found");                    
       };

       const existingConnectionRequest = await ConnenctionRequest.findOne({
        $or: [
            { fromUserId, toUserId },
            { fromUserId : toUserId, toUserId : fromUserId }
        ]
       });

       if(existingConnectionRequest) {
            throw new Error("Cannot sent the connection request because already presented");
       };

       const connenctionRequest = new ConnenctionRequest({
        fromUserId : fromUserId,
        toUserId : toUserId,
        status : status
       });

       const data = await connenctionRequest.save();

       res.json({
            message : req.user.firstName + " is " + status + " in " + toUser.firstName,
            data : data
       });

    }catch(error){
        res.status(400).send("ERROR: "+error.message);
    }

});

module.exports = requestRouter;