import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, addToWishlist, wishlist, user } = useContext(ShopContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [qty, setQty] = useState(1);


    const handleAddToCart = () => {
        if (!user) {
            alert("Please login to add items to cart");
            navigate('/login', { state: { from: window.location.pathname } });
        } else {
            addToCart(product, qty, selectedSize, selectedColor);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/shop')} className="text-accent font-bold uppercase tracking-widest underline">Back to Shop</button>
            </div>
        </div>
    );

    const isWishlisted = wishlist.some((item) => item._id === product._id);

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Container */}
                    <div className="space-y-6">
                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shadow-2xl">
                            <motion.img
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-10">
                        <div>
                            <p className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-3">
                                {product.category}
                            </p>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className={i < Math.round(product.ratings || 4) ? "text-yellow-400 fill-current" : "text-gray-200"} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-400">({product.numReviews || 0} customer reviews)</span>
                            </div>
                        </div>

                        <p className="text-3xl font-bold text-gray-900 border-b border-gray-100 pb-8">Rs. {product.price}</p>

                        <div className="space-y-6">
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>

                            <div className="flex items-center gap-4 py-4 border-y border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="space-y-4">
                                <span className="text-sm font-bold uppercase tracking-widest">Select Color</span>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${selectedColor === color
                                                ? 'bg-black text-white border-black scale-105 shadow-lg'
                                                : 'bg-white border-gray-200 text-gray-900 hover:border-black'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-widest">Select Size</span>
                                    <button className="text-xs font-medium underline text-gray-400">Size Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-14 h-14 flex items-center justify-center rounded-2xl text-xs font-bold transition-all border ${selectedSize === size
                                                ? 'bg-primary border-primary text-white scale-110 shadow-lg'
                                                : 'bg-white border-gray-200 text-gray-900 hover:border-primary'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-xl font-medium hover:text-accent"
                                >
                                    -
                                </button>
                                <div className="w-12 text-center font-bold">{qty}</div>
                                <button
                                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                    className="w-10 h-10 flex items-center justify-center text-xl font-medium hover:text-accent"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>

                            <button
                                onClick={() => addToWishlist(product)}
                                className={`p-5 rounded-full border transition-all active:scale-95 ${isWishlisted
                                    ? 'bg-red-50 text-red-500 border-red-100'
                                    : 'bg-white text-gray-400 border-gray-100 hover:text-red-500 hover:border-red-100'
                                    }`}
                            >
                                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <div className="pt-10 grid grid-cols-2 gap-6 border-t border-gray-100">
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-green-500 shrink-0 mt-1" />
                                <p className="text-xs text-gray-500 leading-relaxed">Free shipping on all orders over Rs. 1500</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check size={18} className="text-green-500 shrink-0 mt-1" />
                                <p className="text-xs text-gray-500 leading-relaxed">Easy returns and exchanges within 30 days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
