import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { cartCount, wishlist, user, logout } = useContext(ShopContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold tracking-tighter text-primary">
                            SIDDHARTHA <span className="text-accent">COLLECTION</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">Home</Link>
                        <Link to="/shop" className="text-sm font-medium hover:text-accent transition-colors">Shop</Link>
                        <div className="relative group">
                            <button className="text-sm font-medium hover:text-accent transition-colors">Categories</button>
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                <Link to="/men" className="block px-4 py-3 text-sm hover:bg-gray-50">Men</Link>
                                <Link to="/women" className="block px-4 py-3 text-sm hover:bg-gray-50">Women</Link>
                                <Link to="/accessories" className="block px-4 py-3 text-sm hover:bg-gray-50">Accessories</Link>
                            </div>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => navigate('/shop')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Search size={20} />
                        </button>
                        <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Heart size={20} />
                            {wishlist.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <User size={20} />
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-semibold">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                        <LogOut size={16} className="mr-2" /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <User size={20} />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Home</Link>
                            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Shop</Link>
                            <div className="space-y-2 pl-4">
                                <Link to="/men" onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-600">Men</Link>
                                <Link to="/women" onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-600">Women</Link>
                                <Link to="/accessories" onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-600">Accessories</Link>
                            </div>
                            <div className="flex items-center space-x-6 pt-4 border-t border-gray-50">
                                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="relative">
                                    <Heart size={24} />
                                </Link>
                                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="relative">
                                    <ShoppingCart size={24} />
                                </Link>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                                    <User size={24} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
