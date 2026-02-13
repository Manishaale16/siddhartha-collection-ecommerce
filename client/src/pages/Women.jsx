import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const Women = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/products?category=women&keyword=${keyword}&pageSize=100`);
                let sortedProducts = [...data.products];
                if (sort === 'price-low') sortedProducts.sort((a, b) => a.price - b.price);
                if (sort === 'price-high') sortedProducts.sort((a, b) => b.price - a.price);
                setProducts(sortedProducts);
            } catch (error) {
                console.error('Error fetching women products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, sort]);

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="bg-[#fdf2f2] py-20 text-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h4 className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4">Collection</h4>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">Women's Fashion</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Elegant, trendy, and comfortable styles designed for every woman's unique personality.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-6 justify-between mb-12">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search in Women's..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-4 py-4 bg-gray-50 rounded-2xl">
                        <SlidersHorizontal size={18} className="text-gray-400" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium pr-8 cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Women;
