const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');

profileRouter.get('/profile/view',userAuth, async(req,res)=> {
    try{
       const user = req.user;
       res.send(user);

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch('/profile/edit',userAuth, async(req,res)=> {
    try{
        if(!validateEditProfileData(req)){
            throw new Error('Invalid Edit Request');
        }

        const loggedUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
        loggedUser.save();
        res.send(`${loggedUser.firstName}, your profile is updated successfully!! `);

    }catch(err){
        res.status(400).send(err.message);
    }
});

profileRouter.patch('/profile/password',userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const {password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        
                const user = new User({
                    password: passwordHash
                });
                loggedInUser.password = user.password;
                await loggedInUser.save();
                res.send("Password Updated succesfully!!");
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = profileRouter;
