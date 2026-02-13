import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, removeFromCart, updateCartQty, cartTotal } = useContext(ShopContext);
    const navigate = useNavigate();

    const shipping = cartTotal > 1500 ? 0 : 150;
    const tax = cartTotal * 0.13;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="text-center space-y-8 max-w-md">
                    <div className="flex justify-center">
                        <div className="p-10 bg-gray-50 rounded-full">
                            <ShoppingBag size={80} className="text-gray-200" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tighter mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">Looks like you haven't added anything to your cart yet. Explore our latest collections today!</p>
                        <Link to="/shop" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all">
                            Start Shopping <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold tracking-tighter mb-12">Shopping Bag</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {cartItems.map((item) => (
                                <motion.div
                                    key={`${item._id}-${item.size}-${item.color}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-all"
                                >
                                    <Link to={`/product/${item._id}`} className="shrink-0 w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </Link>

                                    <div className="flex-1 space-y-2 text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <Link to={`/product/${item._id}`} className="text-lg font-bold hover:text-accent transition-colors">
                                                {item.name}
                                            </Link>
                                            <p className="text-xl font-bold">Rs. {item.price}</p>
                                        </div>

                                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-sm text-gray-500">
                                            <p>Size: <span className="font-bold text-gray-900">{item.size}</span></p>
                                            {item.color && <p>Color: <span className="font-bold text-gray-900">{item.color}</span></p>}
                                            <p>Category: <span className="font-bold text-gray-900 capitalize">{item.category || 'Fashion'}</span></p>
                                        </div>

                                        <div className="flex justify-center sm:justify-start items-center gap-6 pt-4">
                                            <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 border border-gray-100">
                                                <button
                                                    onClick={() => updateCartQty(item._id, item.size, item.color, Math.max(1, item.qty - 1))}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-accent"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                                                <button
                                                    onClick={() => updateCartQty(item._id, item.size, item.color, Math.min(item.stock || 100, item.qty + 1))}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-accent"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item._id, item.size, item.color)}
                                                className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                                            >
                                                <Trash2 size={16} />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8 sticky top-32">
                            <h3 className="text-2xl font-bold tracking-tighter">Order Summary</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">Rs. {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-bold text-gray-900">{shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Estimated Tax</span>
                                    <span className="font-bold text-gray-900">Rs. {tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-3xl font-bold text-primary">Rs. {(cartTotal + shipping + tax).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-lg hover:shadow-black/20"
                            >
                                Checkout <ArrowRight size={20} />
                            </button>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg">
                                    <ShoppingBag size={20} className="text-accent" />
                                </div>
                                <p className="text-[10px] text-gray-500 leading-tight uppercase tracking-widest font-bold">
                                    Free shipping on orders over <span className="text-primary">Rs. 1500</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
