const mongoose = require('mongoose')

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, 'Subcategory must be unique'],
        minlength: [2, 'Too short SubCategory name'],
        maxlength: [32, 'Too short SubCategory name']
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Subcategory must be belong to parent category']
    }
}, {timestamps: true})


module.exports = mongoose.model('subCategory', subCategorySchema)