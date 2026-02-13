import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-800 pb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tighter">
                            SIDDHARTHA <span className="text-accent">COLLECTION</span>
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Curating the finest fashion since 2010. We bring you the perfect blend of tradition and modernity in every stitch.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-accent transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-accent transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-accent transition-colors"><Twitter size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
                            <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">Shop All</Link></li>
                            <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors text-sm">My Account</Link></li>
                            <li><Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors text-sm">Wishlist</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Categories</h4>
                        <ul className="space-y-4">
                            <li><Link to="/men" className="text-gray-400 hover:text-white transition-colors text-sm">Men's Collection</Link></li>
                            <li><Link to="/women" className="text-gray-400 hover:text-white transition-colors text-sm">Women's Collection</Link></li>
                            <li><Link to="/accessories" className="text-gray-400 hover:text-white transition-colors text-sm">Accessories</Link></li>
                            <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-sm text-gray-400">
                                <MapPin size={18} className="text-accent shrink-0" />
                                <span>Birendranagr-10 Surkhet, Nepal </span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-400">
                                <Phone size={18} className="text-accent shrink-0" />
                                <span>+977 9848112256</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-400">
                                <Mail size={18} className="text-accent shrink-0" />
                                <span>info@siddharthacollection.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                    <p>© 2026 Siddhartha Collection. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
