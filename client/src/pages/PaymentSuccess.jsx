import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, setCartItems } = useContext(ShopContext);
    const [status, setStatus] = useState('Processing');
    const [message, setMessage] = useState('Verifying your payment...');
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            // Retrieve params
            const data = searchParams.get('data'); // eSewa
            if (!data) {
                console.error("Missing payment params in URL:", searchParams.toString());
                setStatus('Failed');
                setMessage('Invalid payment parameters.');
                return;
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`,
                    },
                };

                let response;
                if (data) {
                    // eSewa Verification
                    response = await axios.post('/api/payment/esewa/verify', { data }, config);
                }

                if (response?.data.status === 'Completed' || response?.data.details?.status === 'Completed' || response?.data.details?.status === 'COMPLETE') {
                    setStatus('Success');
                    setMessage('Your payment has been successfully verified.');
                    setOrderInfo(response.data.order); // Backend returns updated order

                    // Clear Cart
                    setCartItems([]);
                    localStorage.removeItem('cart');
                } else {
                    throw new Error('Payment status not completed.');
                }

            } catch (error) {
                setStatus('Failed');
                setMessage(error.response?.data?.message || 'Payment verification failed.');
            }
        };

        if (user && status === 'Processing') {
            verifyPayment();
        } else if (!user) {
            // If user is not logged in (e.g. session lost), redirect to login or show error
            // Ideally preserve state or ask to login. For now assuming persistent login.
            // or check if we can verify without token (if purely S2S based, but we used protect middleware).
            // If token missing, user might need to login.
        }

    }, [searchParams, user, status, setCartItems]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center space-y-6">
                {status === 'Processing' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
                        <p className="text-gray-500">Please wait while we confirm your transaction securely.</p>
                    </div>
                )}

                {status === 'Success' && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                        <p className="text-gray-500 mb-8">{message}</p>

                        {/* Order Details */}
                        {orderInfo && (
                            <div className="w-full bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-3 border border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Order ID</span>
                                    <span className="font-mono font-bold text-gray-900 text-sm">{orderInfo._id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Payment Method</span>
                                    <span className="font-bold text-gray-900 text-sm">{orderInfo.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <span className="font-bold text-green-600 text-sm uppercase tracking-wider">{orderInfo.status}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between items-center mt-3">
                                    <span className="font-bold text-gray-900">Total Amount</span>
                                    <span className="font-bold text-primary text-lg">Rs. {orderInfo.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        <div className="w-full grid grid-cols-2 gap-4">
                            <button onClick={() => navigate('/profile')} className="py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">
                                View Order
                            </button>
                            <button onClick={() => navigate('/')} className="py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all">
                                Shop More
                            </button>
                        </div>
                    </div>
                )}

                {status === 'Failed' && (
                    <div className="flex flex-col items-center text-red-500">
                        <XCircle className="w-16 h-16 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="text-gray-500 mb-8">{message}</p>
                        <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-black transition-all">
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
