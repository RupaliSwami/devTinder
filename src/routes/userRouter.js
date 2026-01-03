const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get('/user/requests/received', userAuth, async(req,res)=> {
    try{

        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender about skills");

        res.json({
            Message: "Data Fetched Successfully!!",
            data: connectionRequest
        });
    }catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async(req,res)=> {
    try{

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId : loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", "firstName lastName age gender about skills")
        .populate("toUserId", "firstName lastName age gender about skills");

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data});
    }catch(err){
        res.status(404).send({Message: err.message });
    }
});

userRouter.get('/feed', userAuth, async(req,res)=> {
    try{

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id},
            ],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new set();
        connectionRequest.forEach((req) =>{
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId);
        });

        const users = await User.find({
            $and: [
                { _id: {$in: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id }},
            ],
        })
        .select("fromUserId", "firstName lastName age gender about skills")
        .skip(skip)
        .limit(limit);

        res.send(users);
    }catch(err){
        res.status(400).json({Error:  + err.message});
    }
});

module.exports = userRouter;
