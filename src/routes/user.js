const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const USER_SAFE_DATA = "firstName lastName skills photoUrl gender age"
        const receivedRequests = await ConnectionRequest.find({
            toUserId : req.user._id,
            status : "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Your Pending Connection Requests: ",
            data: receivedRequests
        })
    }catch(err){
        res.status(400).send("Error "+err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const USER_SAFE_DATA = "firstName lastName skills photoUrl gender age";

        const connections = await ConnectionRequest.find({
            $or : [
                {fromUserId : req.user._id, status : 'accepted'},
                {toUserId : req.user._id, status : 'accepted'}
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((rows) => {
            if(req.user._id.equals(rows.fromUserId._id)){
                
                return rows.toUserId;
            }
            return rows.fromUserId;
        });

        res.json({
            message : "Your Connections : ",
            data : data
        });
    }catch(err){
        res.status(400).send(err.message);
    }

});

module.exports = userRouter;