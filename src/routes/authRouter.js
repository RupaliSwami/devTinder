const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// User SignUp
authRouter.post('/signup', async (req,res) => {
    try{

        //Validation of userData
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        // Password Encryption
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("user added succesfully!!")
    }catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
});

//User Login
authRouter.post('/login', async(req,res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error('Invalid Credentials.');
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie('token', token, {expires: new Date(Date.now() + 8 * 36000)});
            res.send('Login successful!!');
        } else {
            throw new Error('Invalid credentials.');
        }
    }catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
});

//user LogOut
authRouter.post('/logout', async(req,res)=> {
    res.cookie('token', null, {
        expires : new Date(Date.now())
    });
    res.send("Logout Successfully!!");
})

module.exports = authRouter;
