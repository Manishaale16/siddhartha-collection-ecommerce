import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('userInfo');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);


    useEffect(() => {
        if (user) {
            localStorage.setItem('userInfo', JSON.stringify(user));
        } else {
            localStorage.removeItem('userInfo');
        }
    }, [user]);

    const addToCart = (product, qty = 1, size = 'M', color = '') => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) => x._id === product._id && x.size === size && x.color === color);
            if (existItem) {
                return prevItems.map((x) =>
                    x._id === product._id && x.size === size && x.color === color ? { ...existItem, qty: existItem.qty + qty } : x
                );
            } else {
                return [...prevItems, { ...product, qty, size, color }];
            }
        });
    };

    const removeFromCart = (id, size, color) => {
        setCartItems((prevItems) => prevItems.filter((x) => !(x._id === id && x.size === size && x.color === color)));
    };

    const updateCartQty = (id, size, color, qty) => {
        setCartItems((prevItems) =>
            prevItems.map((x) => (x._id === id && x.size === size && x.color === color ? { ...x, qty } : x))
        );
    };

    // Fetch wishlist when user logs in
    useEffect(() => {
        if (user) {
            const fetchWishlist = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const { data } = await axios.get('/api/wishlist', config);
                    setWishlist(data);
                } catch (error) {
                    console.error('Failed to fetch wishlist', error);
                }
            };
            fetchWishlist();
        } else {
            setWishlist([]); // Clear wishlist if no user
        }
    }, [user]);


    const addToWishlist = async (product) => {
        if (!user) {
            alert('Please login to use wishlist');
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/wishlist', { productId: product._id }, config);
            setWishlist(data); // Expecting backend to return updated list of products
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding to wishlist');
        }
    };

    const removeFromWishlist = async (id) => {
        if (!user) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.delete(`/api/wishlist/${id}`, config);
            setWishlist(data);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <ShopContext.Provider
            value={{
                cartItems,
                setCartItems,
                addToCart,
                removeFromCart,
                updateCartQty,
                cartCount,
                cartTotal,
                wishlist,
                addToWishlist,
                removeFromWishlist,
                user,
                setUser,
                logout,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};
