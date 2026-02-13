import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sort, setSort] = useState('newest');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || '';

    useEffect(() => {
        setSelectedCategory(initialCategory);
    }, [initialCategory]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const catRes = await axios.get('/api/categories');
                setCategories(catRes.data);

                let url = `/api/products?keyword=${keyword}&pageSize=100`;
                if (selectedCategory) {
                    url += `&category=${selectedCategory}`;
                }
                const prodRes = await axios.get(url);

                let sortedProducts = [...prodRes.data.products];
                if (sort === 'price-low') sortedProducts.sort((a, b) => a.price - b.price);
                if (sort === 'price-high') sortedProducts.sort((a, b) => b.price - a.price);

                setProducts(sortedProducts);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [keyword, selectedCategory, sort]);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-gray-50 py-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Our Collection</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Explore our curated selection of high-quality fashion pieces for every style and occasion.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-6 justify-between mb-12">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-4 bg-gray-50 rounded-2xl">
                            <Filter size={18} className="text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm font-medium pr-8 cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                                ))}
                            </select>
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
                </div>

                {/* Product Grid */}
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

export default Shop;
