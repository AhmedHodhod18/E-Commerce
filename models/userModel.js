const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        minlength: [3, 'Too short name'],
        maxlength: [32, 'Too long name']
    },
    slug: {
        type: String,
        lowerCase: true,
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: [true, 'Email must be unique'],
        minlength: [3, 'Too short email'],
        maxlength: [32, 'Too long email']
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: [3, 'Too short password'],
        maxlength: [32, 'Too long password']
    },
    passwordChangedAt: Date,
    phone: String,
    profileImage: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    }

}, {timestamps: true})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    // hashing password
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema)

module.exports = User;
