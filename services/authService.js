/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');


const createToken = (payload) => jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
});

exports.signUp = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    });
    const token = createToken(user._id);
    res.status(201).json({ data: user, token });
});

exports.logIn = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password'), 401);
    }
    const token = createToken(user._id);
    res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
    
    // 1) check if token exist 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith(`Bearer`)) {
        token = req.headers.authorization.split(' ')[1];
        console.log(token);
    }
    if (!token) {
        return next(new ApiError(`You are not login, please login to get access to this route`), 401);
    }
    // 2) verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    // console.log(decoded);
    const currentUser = await User.findById(decoded.userId);
    
    // 3) check if user exist
    if (!currentUser) {
        return next(new ApiError('The user that belong to this token does no longer exist'), 401)
    }
        // 4) check if user change this password after token created
        if (currentUser.passwordChangedAt) {
            const passwordChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10)
            
            // password changed after token created // error
            if (passwordChangedTimestamp > decoded.iat) {
                return next(new ApiError('Your password has been changed, please try again'), 401)
            }
        }
        req.user = currentUser;
        next();
    })
