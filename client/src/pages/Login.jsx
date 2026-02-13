import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, setUser } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate(location.state?.from || '/');
        }
    }, [user, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/api/users/login', { email, password });
            setUser(data);
            navigate(location.state?.from || '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Side Visual */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=1887&auto=format&fit=crop"
                    alt="Login"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
                <div className="absolute bottom-20 left-20 text-white space-y-4 max-w-sm">
                    <h2 className="text-5xl font-bold tracking-tighter">Welcome Back To Siddhartha Collection.</h2>
                    <p className="text-white/80 leading-relaxed font-medium capitalize">Discover the finest fabrics and modern designs curated just for you.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-20">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-12"
                >
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold tracking-tighter">Sign In</h1>
                        <p className="text-gray-500">Enter your details to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all outline-none"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                                    <Link to="#" className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-xl hover:shadow-black/20 disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Don't have an account? <Link to="/register" className="text-accent font-bold uppercase tracking-widest hover:underline ml-2">Create Account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
