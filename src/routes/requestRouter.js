const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req, res) => {

    try{
        
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const isAllowedStatus = ["ignored", "interested", "accepted", "rejected"];
        if(!isAllowedStatus.includes(status)){
            return res.status(400).json({"message": "Invalid status type!!" + status});
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message: "User does not exists!!"});
        }

        // If there is an existing ConnectionRequest
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if(existingRequest){
            return res.status(400).send({message: "Connection Request already exists!!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save()

        return res.json({
            message: "Connection Request sent successfully!!",
            data
        })
    }catch(err){
        res.status(400).json("Error " + err.message);
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req,res)=> {

    try{

        const loggedInUser = req.user;
        const { status } = req.params;
        const {requestId} = req.params;

        const AllowedStatus = ['accepted', 'rejected'];
        if(!AllowedStatus.includes(status)){
           return res.status(404).json({message: "Status is not allowed!!"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if(!connectionRequest){
           return res.status(404).json({message: "Connection request is not found!!"});
        }

        connectionRequest.status = status;
        const data = connectionRequest.save();
        return res.json({ message: "Connection request " + status , data });

    }catch(err){
        res.status(400).send({'Error': + err.message})
    }
});

module.exports = requestRouter;
