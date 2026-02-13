import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { ArrowLeft, CheckCircle2, CreditCard, Truck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cartItems, cartTotal, user, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    district: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [esewaConfig, setEsewaConfig] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [cartItems, isSuccess, navigate]);

  const shipping = cartTotal > 1500 ? 0 : 150;
  const tax = cartTotal * 0.13;
  const total = cartTotal + shipping + tax;

  useEffect(() => {
    if (esewaConfig) {
      document.getElementById('esewa-form').submit();
    }
  }, [esewaConfig]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
          size: item.size,
          color: item.color,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };

      // STRICT LOGIC: Create Order First
      const { data: createdOrder } = await axios.post('/api/orders', orderData, config);
      const orderId = createdOrder._id;

      if (paymentMethod === 'Cash on Delivery') {
        setIsSuccess(true);
        setCartItems([]);
        localStorage.removeItem('cart');
      } else if (paymentMethod === 'eSewa') {
        // eSewa Integration
        const { data } = await axios.post(
          '/api/payment/esewa/config',
          {
            orderId: orderId,
            totalAmount: Math.round(total).toString()
          },
          config
        );
        setEsewaConfig(data);
        // Note: Form auto-submits via useEffect
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Order failed');
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl text-center space-y-8 max-w-md w-full"
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tighter mb-4 text-gray-900">Order Placed!</h2>
            <p className="text-gray-500 leading-relaxed mb-8">Your order has been placed successfully and is being processed.</p>
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all active:scale-95"
            >
              View Orders
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {esewaConfig && (
        <form
          id="esewa-form"
          method="POST"
          action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        >
          <input type="hidden" name="amount" value={Math.round(total).toString()} />
          <input type="hidden" name="tax_amount" value="0" />
          <input type="hidden" name="service_charge" value="0" />
          <input type="hidden" name="total_amount" value={Math.round(total).toString()} />
          <input type="hidden" name="transaction_uuid" value={esewaConfig.transactionUuid} />
          <input type="hidden" name="product_code" value={esewaConfig.productCode} />
          <input type="hidden" name="product_service_charge" value="0" />
          <input type="hidden" name="product_delivery_charge" value="0" />
          <input type="hidden" name="success_url" value={esewaConfig.successUrl} />
          <input type="hidden" name="failure_url" value={esewaConfig.failureUrl} />
          <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
          <input type="hidden" name="signature" value={esewaConfig.signature} />
        </form>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/cart')}
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </button>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-accent">
                  <Truck size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tighter text-gray-900">Shipping Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                  <input
                    required
                    placeholder="e.g. 123 Fashion St"
                    className="input"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">City</label>
                  <input
                    required
                    placeholder="e.g. Kathmandu"
                    className="input"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">District</label>
                  <input
                    required
                    placeholder="e.g. Kathmandu"
                    className="input"
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                  <input
                    required
                    placeholder="e.g. 9841234567"
                    className="input"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-accent">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tighter text-gray-900">Payment Method</h3>
              </div>

              <div className="space-y-4">
                {/* COD */}
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`group flex items-center justify-between p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery'
                    ? 'bg-accent/5 border-accent'
                    : 'bg-white border-gray-50 hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xs ${paymentMethod === 'Cash on Delivery' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'}`}>
                      COD
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when your items arrive</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Cash on Delivery' ? 'border-accent' : 'border-gray-200'}`}>
                    {paymentMethod === 'Cash on Delivery' && <div className="w-3 h-3 bg-accent rounded-full" />}
                  </div>
                </div>

                {/* eSewa */}
                <div
                  onClick={() => setPaymentMethod('eSewa')}
                  className={`group flex items-center justify-between p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${paymentMethod === 'eSewa'
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-gray-50 hover:border-green-200'
                    }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xs ${paymentMethod === 'eSewa' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-500'}`}>
                      eSewa
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">eSewa Mobile Wallet</p>
                      <p className="text-sm text-gray-500">Fast and secure digital payment</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'eSewa' ? 'border-green-500' : 'border-gray-200'}`}>
                    {paymentMethod === 'eSewa' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8 sticky top-32">
              <h3 className="text-2xl font-bold tracking-tighter text-gray-900">Order Summary</h3>

              {/* Item List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="w-16 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Size: {item.size} {item.color && `| Color: ${item.color}`} × {item.qty}
                      </p>
                      <p className="text-sm font-bold text-accent mt-1">Rs. {(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100">
                <div className="flex justify-between text-gray-500">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="text-sm">Shipping</span>
                  <span className="font-bold text-gray-900">{shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="text-sm">Tax (13%)</span>
                  <span className="font-bold text-gray-900">Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-primary">Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-6 bg-primary text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Complete Order <ChevronRight size={20} />
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center justify-center">
                Secure Payment Guaranteed
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;