const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : [ "ignored", "accepted", "interested", "rejected" ],
            message : `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps : true
});


connectionRequestSchema.index({ fromUserId : 1, toUserId : 1});

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("caanot sent connection request to yourself");
    }
});

const ConnenctionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnenctionRequest;
