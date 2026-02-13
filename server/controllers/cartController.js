const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            res.json(cart.cartItems);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { product, name, qty, image, price, size } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            // Cart exists
            const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === product && p.size === size);

            if (itemIndex > -1) {
                // Product exists in cart, update quantity
                let productItem = cart.cartItems[itemIndex];
                productItem.qty += qty;
                cart.cartItems[itemIndex] = productItem;
            } else {
                // Product does not exist in cart, push new item
                cart.cartItems.push({ product, name, qty, image, price, size });
            }
            await cart.save();
            res.json(cart.cartItems);
        } else {
            // No cart for user, create new cart
            const newCart = await Cart.create({
                user: req.user._id,
                cartItems: [{ product, name, qty, image, price, size }]
            });
            res.status(201).json(newCart.cartItems);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
};
