import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get('/api/products?pageSize=8&isFeatured=true'),
                    axios.get('/api/categories'),
                ]);
                setFeaturedProducts(prodRes.data.products);
                setCategories(catRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="overflow-hidden">
            <Hero />

            {/* Categories Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <h4 className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-3">Explore Collections</h4>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Shop by Category</h2>
                        </div>
                        <Link to="/shop" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
                            View All Shop <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
                            >
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                                    <h3 className="text-3xl font-bold text-white mb-2">{cat.name}</h3>
                                    <p className="text-gray-300 text-sm mb-6 max-w-[200px]">{cat.description}</p>
                                    <Link to={`/${cat.slug}`} className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group-hover:text-accent transition-colors">
                                        Explore Collection <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h4 className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-3">Trending Now</h4>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Featured Products</h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-20 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex items-center gap-6 p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                            <div className="p-4 bg-primary text-white rounded-2xl">
                                <Truck size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1">Fast Delivery</h3>
                                <p className="text-sm text-gray-500">Free shipping on orders over Rs. 1500</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                            <div className="p-4 bg-primary text-white rounded-2xl">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1">Secure Payment</h3>
                                <p className="text-sm text-gray-500">100% secure payment methods</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                            <div className="p-4 bg-primary text-white rounded-2xl">
                                <RefreshCcw size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1">Easy Returns</h3>
                                <p className="text-sm text-gray-500">Return within 30 days of purchase</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
