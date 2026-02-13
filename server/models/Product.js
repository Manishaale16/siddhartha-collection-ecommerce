const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    image: {
        type: String,
        required: [true, 'Product image is required'],
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['men', 'women', 'accessories'],
        lowercase: true,
    },
    sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Universal'],
    }],
    colors: [{
        type: String,
    }],
    stock: {
        type: Number,
        required: [true, 'Stock count is required'],
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

