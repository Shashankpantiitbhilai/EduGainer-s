import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Paper,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowBack,
  Payment
} from '@mui/icons-material';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/ecommerce/helpers';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    itemCount, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    calculateTotal 
  } = useCart();

  const total = calculateTotal();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/shop/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Skeleton variant="rectangular" height={120} />
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} width="60%" />
                    <Skeleton variant="text" height={24} width="40%" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Add some products to get started
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowBack />}
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <Card key={item._id} sx={{ overflow: 'visible' }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={item.product.images?.[0]?.url || '/api/placeholder/200/120'}
                        alt={item.product.name}
                        sx={{ borderRadius: 1, objectFit: 'cover' }}
                      />
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.product.shortDescription}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(item.product.price?.selling || item.product.price)}
                      </Typography>
                    </Grid>

                    {/* Quantity and Actions */}
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {/* Quantity Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 0;
                              handleQuantityChange(item._id, newQuantity);
                            }}
                            sx={{ width: 80 }}
                            inputProps={{ 
                              style: { textAlign: 'center' },
                              min: 1
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>

                        {/* Remove Button */}
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </Button>

                        {/* Subtotal */}
                        <Typography variant="h6" sx={{ textAlign: 'center', mt: 1 }}>
                          {formatCurrency((item.product.price?.selling || item.product.price) * item.quantity)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            {/* Cart Actions */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleContinueShopping}
                startIcon={<ArrowBack />}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
                startIcon={<Delete />}
              >
                Clear Cart
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatCurrency(total)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax (18%):</Typography>
              <Typography>{formatCurrency(total * 0.18)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(total + (total * 0.18))}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Payment />}
              onClick={handleCheckout}
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Alert severity="info" sx={{ mt: 2 }}>
              Free shipping on orders over ₹500
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
