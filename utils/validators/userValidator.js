const slugify = require('slugify');
const bcrypt = require('bcrypt');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel')

exports.createUserValidator = [
    check('name').notEmpty().withMessage('User required').isLength({ min: 3 }).withMessage('Too short User name')
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage('Email required').isEmail().withMessage('Invalid email address')
    .custom((val) =>
        User.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error('email already in use'));
            }
        })),
    check('password').notEmpty().withMessage('Password required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
            throw new Error('Password Confirmation incorrect');
        }
        return true;
    }),
    check('passwordConfirm').notEmpty().withMessage('Password confirmation required'),
    check('phone').optional().isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
    check('profileImage').optional(),
    check('role').optional(),
    validatorMiddleware,
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('name').optional()
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage('Email required').isEmail().withMessage('Invalid email address')
    .custom((val) =>
        User.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error('email already in use'));
            }
        })),
        check('phone').optional().isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
        check('profileImage').optional(),
        check('role').optional(),
    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('currentPassword').notEmpty().withMessage('Invalid password format'),
    body('passwordConfirm').notEmpty().withMessage('Enter your new password'),
    body('password').notEmpty().withMessage('You must enter new password')
    .custom(async (val, { req }) => {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('User not found');
        }
        const checkPassword = await bcrypt.compare(req.body.currentPassword, user.password)
        if (!checkPassword) {
            throw new Error('Current password incorrect');
        }
        if (val !== req.body.passwordConfirm) {
            throw new Error('Password Confirmation incorrect');
        }
        return true;
    }),
    validatorMiddleware,
]


exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
]