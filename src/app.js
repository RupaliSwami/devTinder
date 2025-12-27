const express = require('express');
const connectDb = require('./config/database');
const app = express();
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const {userAuth} = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

// User SignUp
app.post('/signup', async (req,res) => {
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
app.post('/login', async(req,res) => {
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
        }else{
            throw new Error('Invalid credentials.');
        }
    }catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
});

app.get('/profile',userAuth, async(req,res)=> {
    try{
       const user = req.user;
       res.send(user);

    }catch(err){
        res.status(400).send("ERROR1: " + err.message);
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
app.patch('/user/:userId', async(req,res)=> {
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

connectDb().then(() => {
    console.log('Database is connected successfulyy!!');
    app.listen(7777, (req,res) => {
        console.log('Server is runnning on port 7777.');
    })
}).catch((error) => {
    console.error('database is not connected.', error.message)
})

app.listen(3000);