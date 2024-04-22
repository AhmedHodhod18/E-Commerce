const express = require('express')
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator
} = require('../utils/validators/userValidator')

const { 
    getUsers, 
    createUser, 
    getUser, 
    updateUser,
    uploadUserImage,
    resizeImage,
    deleteUser,
    changeUserPassword
} = require('../services/userService');

const router = express.Router();
router.put('/changePassword/:id', changeUserPasswordValidator,changeUserPassword);

router.route('/').get(getUsers).post(uploadUserImage, resizeImage, createUserValidator,createUser);
router.route('/:id').get(getUserValidator, getUser).put(updateUserValidator, updateUser).delete(deleteUserValidator, deleteUser);



module.exports = router