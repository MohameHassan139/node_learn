const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/users_roles");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(userRoles),
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default: "uploads/profile.png"
    }

});

const User = mongoose.model('User', userSchema);

module.exports = { User };