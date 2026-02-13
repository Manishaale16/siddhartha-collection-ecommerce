import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState('');

    const { user, setUser } = useContext(ShopContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const { data } = await axios.post('/api/users', { name, email, password });
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                setUser(data);
                navigate('/');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Side Visual */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1539109132332-629ee670a649?q=80&w=1887&auto=format&fit=crop"
                    alt="Register"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
                <div className="absolute bottom-20 left-20 text-white space-y-4 max-w-sm">
                    <h2 className="text-5xl font-bold tracking-tighter">Join The Collection.</h2>
                    <p className="text-white/80 leading-relaxed font-medium">Be the first to know about new arrivals, exclusive sales and fashion insights.</p>
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
                        <h1 className="text-5xl font-bold tracking-tighter">Join Now</h1>
                        <p className="text-gray-500">Create your account to start shopping.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 text-sm font-medium">
                                {success}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

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
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all outline-none"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-xl hover:shadow-black/20 disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Already have an account? <Link to="/login" className="text-accent font-bold uppercase tracking-widest hover:underline ml-2">Sign In</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
