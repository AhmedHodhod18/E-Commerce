const slugify = require('slugify')
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

exports.getsubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subcategory id format'),
    validatorMiddleware,
]

exports.createSubCategoryValidator = [
    check('name').notEmpty().withMessage('SubCategory required').isLength({ min: 2 }).withMessage('Too short Subcategory name')
    .isLength({ max: 32 }).withMessage('Too long Subcategory name')
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('category').notEmpty().withMessage('subCategory must be belong to category').isMongoId().withMessage('Invalid Category id format'),
    validatorMiddleware,
];

exports.updatesubCategoryValidator = [
    check('id').notEmpty().withMessage('id of category required').isMongoId().withMessage('Invalid subcategory id format'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
]

exports.deletesubCategoryValidator = [
    check('id').notEmpty().withMessage('id of category required').isMongoId().withMessage('Invalid subcategory id format'),
    validatorMiddleware,
]
