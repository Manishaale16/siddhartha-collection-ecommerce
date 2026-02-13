import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
    const { wishlist, user } = useContext(ShopContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/wishlist' } });
        }
    }, [user, navigate]);

    if (!user) return null; // Prevent flash of content

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="text-center space-y-8 max-w-md">
                    <div className="flex justify-center">
                        <div className="p-10 bg-gray-50 rounded-full">
                            <Heart size={80} className="text-gray-200" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tighter mb-4">Wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">Save your favorite items here to keep track of what you love.</p>
                        <Link to="/shop" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all">
                            Explore Shop <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="bg-gray-50 py-16 border-b border-gray-100 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">My Wishlist</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">All your favorite picks in one place.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {wishlist.map((product) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
