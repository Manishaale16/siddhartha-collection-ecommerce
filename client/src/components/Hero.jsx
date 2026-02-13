import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
    const [showStory, setShowStory] = React.useState(false);

    return (
        <div className="relative h-[90vh] flex items-center overflow-hidden bg-gray-950">
            {/* Background with dynamic effect */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                    alt="Fashion Hero"
                    className="w-full h-full object-cover opacity-60 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <span className="inline-block px-4 py-2 bg-accent/20 backdrop-blur-md text-accent text-xs font-bold uppercase tracking-[0.3em] rounded-full">
                            New Season, New Styles
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
                            Elevate Your <br />
                            <span className="text-accent italic">Everyday Style</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-md">
                            Discover premium men’s wear, elegant women’s fashion, and timeless accessories — curated for modern lifestyles.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                to="/shop"
                                className="group flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-all duration-300"
                            >
                                Shop Now <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <button
                                onClick={() => setShowStory(true)}
                                className="flex items-center justify-center gap-3 px-10 py-5 border border-white/30 backdrop-blur-sm text-white font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-all"
                            >
                                <Play size={20} className="fill-current capitalize" /> View Story
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Floating element for wow factor */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute top-1/2 right-[10%] -translate-y-1/2 hidden xl:block"
            >
                <div className="p-10 rounded-[4rem] border border-white/10 dark-glass relative">
                    <img
                        src="https://media.istockphoto.com/id/821110470/photo/perfect-pairing.jpg?s=612x612&w=0&k=20&c=DM6gW5k0LwfGDtQGSfW_BsE0mv09y1mX7XMB2Heg31I="
                        alt="Product Preview"
                        className="w-[400px] h-[550px] object-cover rounded-[3rem] shadow-2xl shadow-black/50"
                    />
                    <div className="absolute -bottom-10 -left-10 p-8 rounded-3xl bg-white shadow-2xl max-w-[200px]">
                        <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1 text-center">In Stock</p>
                        <p className="text-lg font-bold text-primary leading-tight text-center">Spring Summer Collection '26</p>
                    </div>
                </div>
            </motion.div>

            {/* Decorative vertical line */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <span className="text-white/40 text-[10px] uppercase tracking-[0.5em] vertical-rl">Scroll</span>
                <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 to-transparent"></div>
            </div>

            {/* Story Modal */}
            {showStory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowStory(false)}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-white p-10 md:p-14 rounded-[3rem] max-w-2xl w-full relative space-y-6 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-3xl font-bold tracking-tighter">Our Story</h2>
                        <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
                        <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                            <p>
                                <b>Siddhartha Collection</b> was born from a passion for modern fashion and everyday elegance. We believe style should feel effortless, comfortable, and confident.
                            </p>
                            <p>
                                Our collections for men, women, and accessories are carefully designed using quality materials and timeless silhouettes. Each piece is created to complement your lifestyle — whether you’re dressing for work, travel, or special moments.
                            </p>
                            <p className="font-medium text-primary">
                                At Siddhartha Collection, fashion is not just about what you wear — it’s about how you feel.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowStory(false)}
                            className="mt-4 px-8 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-full text-sm hover:bg-accent transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Hero;
