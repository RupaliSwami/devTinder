const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');

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