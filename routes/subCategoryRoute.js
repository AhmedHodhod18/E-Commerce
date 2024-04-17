const express = require('express');

const {
    createSubCategory, 
    getSubCategories, 
    getSubCategory, 
    updateSubCategory, 
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj,
} = require('../services/subCategoryServices');

const {
    createSubCategoryValidator, 
    getsubCategoryValidator, 
    updatesubCategoryValidator, 
    deletesubCategoryValidator
} = require('../utils/validators/subCategoryValidator')

// mergeParams: allow us to access parameters on other routers
const router = express.Router({ mergeParams: true });

router.route('/').post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory).get(createFilterObj, getSubCategories)
router.route('/:id').get(getsubCategoryValidator, getSubCategory).put(updatesubCategoryValidator, updateSubCategory).delete(deletesubCategoryValidator, deleteSubCategory)




module.exports = router;