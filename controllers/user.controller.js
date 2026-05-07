const asyncWrapper = require("../middleWare/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const APPError = require('../utils/appError');
const bcrypt = require('bcrypt');
const generateJWT = require('../utils/generateGWT');
const { User } = require("../models/user.model");

const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find({},{ password: 0, __v: 0 });
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const getUser = asyncWrapper(async (req, res) => {
    const user = await User.findById(req.params.id, { password: 0, __v: 0 });
    if (!user) return res.status(404).json({ status: httpStatusText.FAIL, data: null, message: 'User not found' });
    res.json({ status: httpStatusText.SUCCESS, data: { user } });
});

const register = asyncWrapper(async (req, res,next) => {
    const { firstName, lastName, email, password, role } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = APPError.createError( 400 ,'Email already exists', httpStatusText.FAIL);
        return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword, role ,avatar: req.file ? req.file.path : null });
    // Generate a JWT token
    const token = generateJWT({ email: user.email, id: user._id , role: user.role});
    user.token = token;
    await user.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { user } });
});


const login= asyncWrapper(async (req, res,next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const error = APPError.createError( 404 ,'Invalid email ', httpStatusText.FAIL);
        return next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = APPError.createError( 404 ,'Invalid password', httpStatusText.FAIL);
        return next(error);
    }
    // Generate a JWT token
    const token = generateJWT({ email: user.email, id: user._id , role: user.role});
    user.token = token;
    await user.save();
    res.json({ status: httpStatusText.SUCCESS, data: { user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName , token: user.token} } });
});



module.exports = {
    getAllUsers,
    getUser,
    register,
    login
};