import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/ecommerce/cartService';
import wishlistService from '../services/ecommerce/wishlistService';
import { useNotification } from './NotificationContext';
import { storage } from '../utils/ecommerce/helpers';
import { STORAGE_KEYS } from '../utils/ecommerce/constants';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_CART':
      return { 
        ...state, 
        items: action.payload.items || [], 
        total: action.payload.total || 0,
        itemCount: action.payload.itemCount || 0,
        loading: false 
      };
    
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + action.payload.quantity
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          itemCount: state.itemCount + action.payload.quantity
        };
      }
    
    case 'UPDATE_CART_ITEM':
      const updatedItems = state.items.map(item =>
        item._id === action.payload.itemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((total, item) => total + item.quantity, 0)
      };
    
    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item._id !== action.payload.itemId);
      return {
        ...state,
        items: filteredItems,
        itemCount: filteredItems.reduce((total, item) => total + item.quantity, 0)
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };
    
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    
    case 'ADD_TO_WISHLIST':
      return { 
        ...state, 
        wishlist: [...state.wishlist, action.payload] 
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return { 
        ...state, 
        wishlist: state.wishlist.filter(item => item._id !== action.payload) 
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  wishlist: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { showSuccess, showError } = useNotification();

  // Load cart and wishlist on mount
  useEffect(() => {
    loadCart();
    loadWishlist();
  }, []);

  // Load cart from API or localStorage
  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Try to load from API first (if user is authenticated)
      try {
        const cartData = await cartService.getCart();
        dispatch({ type: 'SET_CART', payload: cartData.data });
      } catch (error) {
        // Fallback to localStorage if API fails
        const localCart = storage.get(STORAGE_KEYS.CART) || { items: [], total: 0, itemCount: 0 };
        dispatch({ type: 'SET_CART', payload: localCart });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showError('Failed to load cart');
    }
  };

  // Load wishlist from API or localStorage
  const loadWishlist = async () => {
    try {
      try {
        const wishlistData = await wishlistService.getWishlist();
        dispatch({ type: 'SET_WISHLIST', payload: wishlistData.data.items || [] });
      } catch (error) {
        // Fallback to localStorage
        const localWishlist = storage.get(STORAGE_KEYS.WISHLIST) || [];
        dispatch({ type: 'SET_WISHLIST', payload: localWishlist });
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  // Add to cart
  const addToCart = async (product, quantity = 1, variantId = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const response = await cartService.addToCart(product._id, quantity, variantId);
        dispatch({ type: 'SET_CART', payload: response.data });
        showSuccess(`${product.name} added to cart`);
      } catch (error) {
        // Fallback to local storage
        const cartItem = {
          _id: Date.now().toString(),
          product,
          quantity,
          variantId,
          addedAt: new Date().toISOString()
        };
        dispatch({ type: 'ADD_TO_CART', payload: cartItem });
        
        // Save to localStorage
        const updatedCart = {
          items: [...state.items, cartItem],
          itemCount: state.itemCount + quantity
        };
        storage.set(STORAGE_KEYS.CART, updatedCart);
        showSuccess(`${product.name} added to cart`);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showError('Failed to add item to cart');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      try {
        const response = await cartService.updateCartItem(itemId, quantity);
        dispatch({ type: 'SET_CART', payload: response.data });
      } catch (error) {
        // Fallback to local update
        dispatch({ type: 'UPDATE_CART_ITEM', payload: { itemId, quantity } });
        
        // Update localStorage
        const updatedItems = state.items.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        );
        storage.set(STORAGE_KEYS.CART, { 
          items: updatedItems,
          itemCount: updatedItems.reduce((total, item) => total + item.quantity, 0)
        });
      }
      
      showSuccess('Cart updated');
    } catch (error) {
      showError('Failed to update cart');
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      try {
        const response = await cartService.removeFromCart(itemId);
        dispatch({ type: 'SET_CART', payload: response.data });
      } catch (error) {
        // Fallback to local removal
        dispatch({ type: 'REMOVE_FROM_CART', payload: { itemId } });
        
        // Update localStorage
        const filteredItems = state.items.filter(item => item._id !== itemId);
        storage.set(STORAGE_KEYS.CART, { 
          items: filteredItems,
          itemCount: filteredItems.reduce((total, item) => total + item.quantity, 0)
        });
      }
      
      showSuccess('Item removed from cart');
    } catch (error) {
      showError('Failed to remove item from cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      try {
        await cartService.clearCart();
      } catch (error) {
        // Clear localStorage anyway
        storage.remove(STORAGE_KEYS.CART);
      }
      
      dispatch({ type: 'CLEAR_CART' });
      showSuccess('Cart cleared');
    } catch (error) {
      showError('Failed to clear cart');
    }
  };

  // Add to wishlist
  const addToWishlist = async (product) => {
    try {
      try {
        await wishlistService.addToWishlist(product._id);
        dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      } catch (error) {
        // Fallback to localStorage
        const updatedWishlist = [...state.wishlist, product];
        dispatch({ type: 'SET_WISHLIST', payload: updatedWishlist });
        storage.set(STORAGE_KEYS.WISHLIST, updatedWishlist);
      }
      
      showSuccess(`${product.name} added to wishlist`);
    } catch (error) {
      showError('Failed to add to wishlist');
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      try {
        await wishlistService.removeFromWishlist(productId);
      } catch (error) {
        // Update localStorage anyway
        const updatedWishlist = state.wishlist.filter(item => item._id !== productId);
        storage.set(STORAGE_KEYS.WISHLIST, updatedWishlist);
      }
      
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      showSuccess('Item removed from wishlist');
    } catch (error) {
      showError('Failed to remove from wishlist');
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (product) => {
    const isInWishlist = state.wishlist.some(item => item._id === product._id);
    
    if (isInWishlist) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item._id === productId);
  };

  // Calculate cart total
  const calculateTotal = () => {
    return state.items.reduce((total, item) => {
      const price = item.product.price?.selling || item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    calculateTotal,
    loadCart,
    loadWishlist,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
