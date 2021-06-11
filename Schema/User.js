const mongoose = require('mongoose');

//////////// schema for user table in DB ////////////////////
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, default: "user" }

})

///////match user schema with user table ///////
const User = mongoose.model('users', userSchema)

module.exports = User;
