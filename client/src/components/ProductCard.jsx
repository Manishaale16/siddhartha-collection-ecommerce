import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart, addToWishlist, wishlist, user } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!product || !product.name || !product.price || !product.image) {
        return null;
    }

    const handleAddToCart = () => {
        if (!user) {
            alert("Please login to add items to cart");
            navigate('/login', { state: { from: location } });
        } else {
            addToCart(product);
        }
    };

    const handleAddToWishlist = () => {
        if (!user) {
            alert("Please login to use wishlist");
            navigate('/login', { state: { from: location } });
        } else {
            addToWishlist(product);
        }
    };

    const isWishlisted = wishlist.some((item) => item._id === product._id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </Link>

                {/* Badges */}
                {product.isFeatured && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                        Featured
                    </span>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-primary text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                        <ShoppingBag size={16} />
                        Add to Cart
                    </button>
                    <button
                        onClick={handleAddToWishlist}
                        className={`p-3 rounded-full shadow-lg transition-all active:scale-95 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-primary hover:text-red-500'
                            }`}
                    >
                        <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col items-center text-center">
                <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-2">
                    {product.category || 'Collection'}
                </p>
                <Link to={`/product/${product._id}`} className="block mb-2">
                    <h3 className="text-base font-medium text-gray-900 line-clamp-1 group-hover:text-accent transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < Math.round(product.ratings || 4) ? "text-yellow-400 fill-current" : "text-gray-200"} />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">({product.numReviews || 0})</span>
                </div>
                <p className="text-lg font-bold text-gray-900 border-t border-gray-100 pt-3 w-full">
                    Rs. {product.price}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
