const express = require('express');
const connectDb = require('../config/database');
const app = express();
const User = require('../models/user');


app.post('/signup',async (req,res) => {
    const user = new User({
        firstName: 'Admin',
        lastName: 'testing',
        emailId: 'admin@gmai.com',
        password: 'Admin@1233'
    })

    try{
        await user.save();
    res.send("user added succesfully!!")
    }catch(err){
        res.status(400).send('Error while adding the user.')
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