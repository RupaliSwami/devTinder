const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        unique: true,
        minLength: 5 // string 
    },
    lastName : {
        type: String,
        unique: true
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email Id');
            }
        }
    },
    password: {
        type: String,
        required: true,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Please Eter Strong Password!!');
            }
        }
    },
    age : {
        type: Number,
        min : 18 // number
    },
    gender: {
        type: String,
        validate(value){
            if(!['male', 'female'].includes(value)){
                throw new Error('Gender is not valid.')
            }
        }
    },
    photoUrl: {
        type: String,
         validate(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid PhotoURL!!');
            }
        }
    },
    about: {
        type: String,
        default: "Testing......."
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);
