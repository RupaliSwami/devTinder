const express = require('express');
const connectDb = require('../config/database');
const app = express();
const User = require('../models/user');

app.use(express.json())

app.post('/signup',async (req,res) => {
    const user = new User(req.body);

    try{
        await user.save();
        res.send("user added succesfully!!")
    }catch(err){
        res.status(400).send('Error while adding the user.' + err.message);
    }
})

//Get user by emailId
// Get all User
// Get User with specific feilds
app.get('/user', async(req,res)=> {
    
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
app.delete('/user', async(req,res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send('User deleted successfully!!');
    }catch(err){
        res.status(400).send('Somethig went wrong');
    }
})

//Update the user
app.patch('/user', async(req,res)=> {
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id : userId}, data, {returnDocument: 'after'});
        console.log("Update the user", user);
        res.send("User updated successfully!!");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

connectDb().then(() => {
    console.log('Database is connected successfulyy!!');
    app.listen(7777, (req,res) => {
        console.log('Server is runnning on port 7777.');
    })
}).catch((error) => {
    console.error('database is not connected.', error.message)
})

app.listen(3000);