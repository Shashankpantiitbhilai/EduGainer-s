import React from 'react';
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
  Chip,
  Alert,
  Fab
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  ViewList, 
  Search,
  Category,
  LocalOffer,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProductCatalogSimple = () => {
  const navigate = useNavigate();
  // Mock data for testing
  const mockProducts = [
    {
      _id: '1',
      name: 'Introduction to React',
      description: 'Learn React fundamentals with hands-on projects',
      price: 999,
      originalPrice: 1499,
      images: [{ url: 'https://via.placeholder.com/300x200/4285f4/ffffff?text=React+Course' }],
      category: { name: 'Web Development' },
      averageRating: 4.5,
      reviewCount: 25
    },
    {
      _id: '2',
      name: 'Advanced JavaScript',
      description: 'Master modern JavaScript concepts and ES6+',
      price: 1299,
      originalPrice: 1999,
      images: [{ url: 'https://via.placeholder.com/300x200/f4b942/ffffff?text=JavaScript+Course' }],
      category: { name: 'Programming' },
      averageRating: 4.7,
      reviewCount: 42
    },
    {
      _id: '3',
      name: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js',
      price: 1599,
      originalPrice: 2499,
      images: [{ url: 'https://via.placeholder.com/300x200/68d391/ffffff?text=Node.js+Course' }],
      category: { name: 'Backend Development' },
      averageRating: 4.3,
      reviewCount: 18
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700} color="primary">
          🎉 E-Commerce Shop is Working!
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Browse our educational courses and resources
        </Typography>
        
        {/* Success Message */}
        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'success.light', color: 'success.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            ✅ Routing Fixed Successfully!
          </Typography>
          <Typography variant="body1">
            The e-commerce routes are now working correctly. This is a test page with mock data.
            The full ProductCatalog with backend integration will load once the API is connected.
          </Typography>
        </Paper>
      </Box>

      {/* Products Grid */}
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Featured Products
      </Typography>
      
      <Grid container spacing={3}>
        {mockProducts.map((product) => {
          const discount = calculateDiscount(product.originalPrice, product.price);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={200}
                    image={product.images[0].url}
                    alt={product.name}
                  />
                  
                  {discount > 0 && (
                    <Chip
                      label={`${discount}% OFF`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    {product.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.description}
                  </Typography>
                  
                  <Chip 
                    label={product.category.name} 
                    size="small" 
                    variant="outlined" 
                    sx={{ mb: 2, alignSelf: 'flex-start' }}
                  />
                  
                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      {formatCurrency(product.price)}
                    </Typography>
                    {product.originalPrice > product.price && (
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                      >
                        {formatCurrency(product.originalPrice)}
                      </Typography>
                    )}
                  </Box>

                  {/* Rating */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ⭐ {product.averageRating} ({product.reviewCount} reviews)
                  </Typography>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      sx={{ textTransform: 'none' }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <Favorite />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Next Steps */}
      <Paper sx={{ p: 4, mt: 4, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          🚀 Next Steps:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Connect to backend API endpoints</li>
            <li>Implement real product data</li>
            <li>Add search and filtering functionality</li>
            <li>Complete shopping cart and checkout flow</li>
            <li>Add user authentication integration</li>
          </ul>
        </Typography>
      </Paper>
    </Container>
  );
};

export { ProductCatalogSimple };
export default ProductCatalogSimple;
