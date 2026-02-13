import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { Package, User as UserIcon, LogOut, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useContext(ShopContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Side Nav */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                            <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                                <UserIcon size={40} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tighter">{user.name}</h2>
                            <p className="text-gray-500 text-sm mb-8">{user.email}</p>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-red-100 transition-colors"
                            >
                                <LogOut size={16} /> Logout Account
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-not-allowed opacity-50">
                                <div className="flex items-center gap-3">
                                    <UserIcon size={20} className="text-accent" />
                                    <span className="font-bold text-sm">Account Settings</span>
                                </div>
                                <ChevronRight size={16} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-primary text-white rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Package size={20} />
                                    <span className="font-bold text-sm">My Orders</span>
                                </div>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl font-bold tracking-tighter">Your Orders</h2>

                        {orders.length === 0 ? (
                            <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 text-center space-y-6">
                                <Package size={60} className="text-gray-100 mx-auto" />
                                <div>
                                    <h3 className="text-xl font-bold">No orders found</h3>
                                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                                </div>
                                <button onClick={() => navigate('/shop')} className="px-10 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all">
                                    Browse Collection
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-50">
                                            <div>
                                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                                                    <Clock size={14} />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                                <h3 className="text-lg font-bold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-accent/10 text-accent'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                <p className="text-xl font-bold">Rs. {order.totalPrice.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                            {order.orderItems.map((item, i) => (
                                                <div key={i} className="shrink-0 space-y-2">
                                                    <div className="w-20 aspect-[3/4] rounded-xl overflow-hidden bg-gray-50">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-center text-gray-400">
                                                        {item.qty}x {item.size} {item.color && `(${item.color})`}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
