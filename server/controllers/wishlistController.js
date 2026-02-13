const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        if (wishlist) {
            res.json(wishlist.products);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (wishlist) {
            // Check if product already exists in wishlist
            const alreadyExists = wishlist.products.find(p => p.toString() === productId);

            if (alreadyExists) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            wishlist.products.push(productId);
            await wishlist.save();
        } else {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: [productId],
            });
        }

        const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
        res.status(201).json(populatedWishlist.products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.id;
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
            await wishlist.save();

            const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
            res.json(populatedWishlist.products);
        } else {
            res.status(404).json({ message: 'Wishlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
