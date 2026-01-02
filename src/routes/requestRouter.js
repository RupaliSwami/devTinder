const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req,res)=> {
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
        const data = await connectionRequest.save();

        return res.json({
            message: "Connection Request sent successfully!!",
            data
        })
    }catch(err){
        res.status(400).json(err.message);
    }
});

requestRouter.get('/user', async(req,res)=> {
    
    try{
        //const users = await User.find({firstName : /Admin/i}, 'firstName lastName');
        //const users = await User.findOne({ emailId: 'admin@gmai.com' });
        //const users = await User.find();
        const users = await User.find({emailId: req.body.emailId});
        if(users.length === 0){
            res.status(404).send('User not found');
        }

        res.send(users);
    }catch(err){
        res.status(404).send('Something went wrong ' + err.messgae);
    }
})

//Delete user
requestRouter.delete('/user', async(req,res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send('User deleted successfully!!');
    }catch(err){
        res.status(400).send('Somethig went wrong');
    }
})

//Update the user
requestRouter.patch('/user/:userId', async(req,res)=> {
    const userId = req.params.userId;
    const data = req.body;
    try{

        const ALLOWED_UPDATES = [
            'userId',
            'firstName',
            'lastName',
            'password',
            'age',
            'gender',
            'photoUrl',
            'about',
            'skills'
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => 
        ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            res.status(400).send("Update is not allowed");
        }
        const user = await User.findByIdAndUpdate({_id : userId}, data, {returnDocument: 'after', runValidators: true});
        console.log("Update the user", user);
        res.send("User updated successfully!!");
    }catch(err){
        res.status(400).send("Something went wrong" + err.message);
    }
})


module.exports = requestRouter;