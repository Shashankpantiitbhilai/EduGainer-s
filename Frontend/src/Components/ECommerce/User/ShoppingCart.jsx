import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingBag,
  LocalOffer,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../../services/ecommerce';

const ShoppingCart = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cartService.getCart();
      
      if (response.success) {
        setCart(response.data);
      } else {
        throw new Error(response.message || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setError(error.message || 'Failed to load cart');
      // Set empty cart as fallback
      setCart({
        items: [],
        totals: {
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    
    try {
      setUpdatingItems(prev => new Set([...prev, itemId]));
      
      const response = await cartService.updateCartItem(itemId, newQuantity);
      
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Optionally show error message
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdatingItems(prev => new Set([...prev, itemId]));
      
      const response = await cartService.removeFromCart(itemId);
      
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const response = await cartService.applyCoupon(couponCode);
      
      if (response.success) {
        setCart(response.data);
        setCouponCode('');
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      // Show error message
    }
  };

  const removeCoupon = async () => {
    try {
      const response = await cartService.removeCoupon();
      
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Failed to remove coupon:', error);
    }
  };

  const proceedToCheckout = () => {
    navigate('/shop/checkout');
  };

  const renderCartItem = (item) => (
    <Card key={item._id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <CardMedia
              component="img"
              height={isMobile ? 120 : 100}
              image={item.product?.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={item.product?.name || 'Product'}
              sx={{ borderRadius: 1, objectFit: 'cover' }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              {item.product?.name || 'Unknown Product'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {item.product?.shortDescription || ''}
            </Typography>
            <Chip 
              label={item.product?.productType?.toUpperCase() || 'DIGITAL'} 
              size="small" 
              color="primary" 
            />
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="primary">
              ₹{item.price?.toLocaleString() || '0'}
            </Typography>
            {item.originalPrice > item.price && (
              <Typography 
                variant="body2" 
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ₹{item.originalPrice?.toLocaleString()}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                disabled={updatingItems.has(item._id) || item.quantity <= 1}
              >
                <Remove />
              </IconButton>
              <TextField
                size="small"
                value={item.quantity}
                inputProps={{ 
                  style: { textAlign: 'center', width: '40px' },
                  min: 1,
                  max: 100
                }}
                disabled={updatingItems.has(item._id)}
              />
              <IconButton 
                size="small" 
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                disabled={updatingItems.has(item._id)}
              >
                <Add />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={1}>
            <IconButton 
              color="error" 
              onClick={() => removeItem(item._id)}
              disabled={updatingItems.has(item._id)}
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderOrderSummary = () => (
    <Paper sx={{ p: 3, height: 'fit-content' }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal</Typography>
          <Typography>₹{cart?.totals?.subtotal?.toLocaleString() || '0'}</Typography>
        </Box>
        
        {cart?.totals?.discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="success.main">Discount</Typography>
            <Typography color="success.main">-₹{cart.totals.discount.toLocaleString()}</Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Shipping</Typography>
          <Typography>
            {cart?.totals?.shipping === 0 ? 'Free' : `₹${cart?.totals?.shipping?.toLocaleString() || '0'}`}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Tax</Typography>
          <Typography>₹{cart?.totals?.tax?.toLocaleString() || '0'}</Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6" color="primary">
            ₹{cart?.totals?.total?.toLocaleString() || '0'}
          </Typography>
        </Box>
      </Box>
      
      {/* Coupon Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Have a coupon?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            fullWidth
          />
          <Button 
            variant="outlined" 
            onClick={applyCoupon}
            disabled={!couponCode.trim()}
          >
            Apply
          </Button>
        </Box>
        
        {cart?.appliedCoupon && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${cart.appliedCoupon.code} (-₹${cart.appliedCoupon.discount})`}
              color="success"
              size="small"
              onDelete={removeCoupon}
            />
          </Box>
        )}
      </Box>
      
      <Button
        variant="contained"
        fullWidth
        size="large"
        endIcon={<ArrowForward />}
        onClick={proceedToCheckout}
        disabled={!cart?.items?.length}
        sx={{ mb: 2 }}
      >
        Proceed to Checkout
      </Button>
      
      <Button
        variant="outlined"
        fullWidth
        onClick={() => navigate('/shop/products')}
      >
        Continue Shopping
      </Button>
    </Paper>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {[1, 2, 3].map((i) => (
              <Card key={i} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Skeleton variant="rectangular" height={100} />
                    </Grid>
                    <Grid item xs={9}>
                      <Skeleton variant="text" height={30} />
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="text" height={20} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="rectangular" height={50} sx={{ mt: 2 }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Shopping Cart
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {(!cart?.items?.length) ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add some products to get started
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/shop/products')}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.items.map(renderCartItem)}
          </Grid>
          
          <Grid item xs={12} md={4}>
            {renderOrderSummary()}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export { ShoppingCart };
export default ShoppingCart;
