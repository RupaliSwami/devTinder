const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async(req, res, next) => {

    try{
        const {token} = req.cookies;

        if(!token){
            throw new Error('Invalid Token!!');
        }

        const decodedObj = await jwt.verify(token, 'Admin@123');
        const {_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user){
            throw new Error('User does not exists!!');
        }
        req.user = user;
        next()
    }catch(err){
        res.status(400).send("NEXT:"+err.message);
    }
}

module.exports = {
    userAuth
};
