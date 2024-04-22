const factory = require('./handlersFactory');
const SubCategory = require('../models/subCategoriesModel');

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};


exports.getSubCategories = factory.getAll(SubCategory);
exports.getSubCategory = factory.getOne(SubCategory);
exports.createSubCategory = factory.createOne(SubCategory);
exports.updateSubCategory = factory.updateOne(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);
