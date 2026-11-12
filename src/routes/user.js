const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const USER_SAFE_DATA = "firstName lastName gender age"
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try{

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 3 ? 3 : limit; 

        const skip = (page - 1) * limit;

        const USER_SAFE_DATA = "firstName lastName gender age"
        const connectionRequests = await ConnectionRequest.find({
            $or : [
                { fromUserId : req.user._id },
                { toUserId : req.user._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        
        connectionRequests.forEach( req => {
            hideUsersFromFeed.add(req.fromUserId)
            hideUsersFromFeed.add(req.toUserId)
        });

        const users = await User.find({
            $and : [
                { _id : { $nin : [...hideUsersFromFeed]} },
                { _id : { $ne : req.user._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({
            data : users
        });

    }catch(err){
        req.status(400).send(err.message);
    };
});

module.exports = userRouter;