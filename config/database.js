const mongoose = require('mongoose');

const connectDb = async() => {
    await mongoose.connect('mongodb+srv://swamirupali27_db_user:GKHmANuisNeKl979@namastenodejs.xalomxc.mongodb.net/')
}

module.exports = connectDb;
