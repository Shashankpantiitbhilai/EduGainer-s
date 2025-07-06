import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Card,
  Typography,
  Button,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Rating,
  Divider,
  Paper,
  IconButton,
  Badge,
  Fab
} from '@mui/material';
import {
  Store,
  LocalLibrary,
  SupportAgent,
  ShoppingCart,
  Favorite,
  Star,
  TrendingUp,
  LocalOffer,
  Security,
  Speed,
  ThumbUp,
  ArrowForward,
  Category,
  School,
  MenuBook,
  Computer,
  Assignment,
  PlayArrow
} from '@mui/icons-material';
import { userProductService, userCategoryService } from '../../../services/ecommerce';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const ECommerceLanding = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        userProductService.getProducts({ limit: 6, featured: true }),
        userCategoryService.getCategories({ limit: 8 })
      ]);

      if (productsResponse.success) {
        const products = productsResponse.data?.products || productsResponse.data || [];
        setFeaturedProducts(products.slice(0, 6));
      }

      if (categoriesResponse.success) {
        const cats = categoriesResponse.data?.categories || categoriesResponse.data || [];
        setCategories(cats.slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = () => {
    navigate('/shop/products');
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop/products?category=${categoryId}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              MeriStationary Store
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                mb: 4,
                fontSize: { xs: '1.2rem', md: '1.8rem' },
                opacity: 0.9
              }}
            >
              Your Complete Educational Marketplace
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.3rem' },
                mb: 6,
                maxWidth: '800px',
                margin: '0 auto 3rem',
                lineHeight: 1.6,
                opacity: 0.8
              }}
            >
              Discover thousands of educational products, from basic stationery to advanced learning materials. 
              Everything students and educators need for academic success.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <MotionButton
                variant="contained"
                size="large"
                onClick={handleShopNow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                  border: 'none',
                  borderRadius: '50px',
                  boxShadow: '0 8px 25px rgba(238, 90, 36, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                    boxShadow: '0 12px 35px rgba(238, 90, 36, 0.4)'
                  }
                }}
                endIcon={<ArrowForward />}
              >
                Shop Now
              </MotionButton>
              
              <MotionButton
                variant="outlined"
                size="large"
                onClick={() => navigate('/shop/categories')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  borderRadius: '50px',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 2
                  }
                }}
                endIcon={<Category />}
              >
                Browse Categories
              </MotionButton>
            </Box>
          </MotionBox>
        </Container>
        
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'url(/videos/stationary.mp4)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 6,
            textAlign: 'center',
            color: '#2d3748'
          }}
        >
          Why Choose MeriStationary?
        </Typography>
        
        <Grid container spacing={4}>
          {[
            {
              icon: <Store sx={{ fontSize: 64, color: '#667eea' }} />,
              title: 'Vast Product Range',
              description: 'From basic stationery to advanced lab equipment, find everything you need for your educational journey.'
            },
            {
              icon: <LocalLibrary sx={{ fontSize: 64, color: '#667eea' }} />,
              title: 'Quality Study Materials',
              description: 'Curated textbooks, reference materials, and exam preparation resources from trusted publishers.'
            },
            {
              icon: <Speed sx={{ fontSize: 64, color: '#667eea' }} />,
              title: 'Fast Delivery',
              description: 'Quick and reliable delivery to ensure you get your educational materials when you need them.'
            },
            {
              icon: <Security sx={{ fontSize: 64, color: '#667eea' }} />,
              title: 'Secure Shopping',
              description: 'Safe and secure payment processing with multiple payment options for your convenience.'
            },
            {
              icon: <LocalOffer sx={{ fontSize: 64, color: '#667eea' }} />,
              title: 'Student Discounts',
              description: 'Special pricing and bulk discounts for students, teachers, and educational institutions.'
            },
            {
              icon: <SupportAgent sx={{ fontSize: 64, color: '#667eea' }} />,
              title: '24/7 Support',
              description: 'Expert customer support to help you find the right products and resolve any concerns.'
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                sx={{
                  height: '100%',
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}
                >
                  {feature.title}
                </Typography>
                <Typography sx={{ color: '#64748b', lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ backgroundColor: '#f7fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: 'center',
              color: '#2d3748'
            }}
          >
            Shop by Category
          </Typography>
          
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} sm={4} md={3} key={category._id || index}>
                <MotionCard
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  onClick={() => handleCategoryClick(category._id)}
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      backgroundColor: '#667eea',
                      fontSize: '1.5rem'
                    }}
                  >
                    {category.name ? category.name.charAt(0).toUpperCase() : 'C'}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#2d3748', fontSize: '0.95rem' }}
                  >
                    {category.name || 'Category'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#64748b', mt: 1, fontSize: '0.85rem' }}
                  >
                    {category.description || 'Explore products'}
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/shop/categories')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '25px',
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.08)'
                }
              }}
            >
              View All Categories
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 6,
            textAlign: 'center',
            color: '#2d3748'
          }}
        >
          Featured Products
        </Typography>
        
        <Grid container spacing={4}>
          {featuredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product._id || index}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                onClick={() => handleProductClick(product._id)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images?.[0] || '/api/placeholder/300/200'}
                  alt={product.name}
                  sx={{ backgroundColor: '#f8fafc' }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: '#2d3748' }}
                  >
                    {product.name || 'Product Name'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#64748b', mb: 2, lineHeight: 1.5 }}
                  >
                    {product.description?.substring(0, 100) || 'Product description...'}
                    {product.description?.length > 100 && '...'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={product.rating || 4.5} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: '#64748b' }}>
                      ({product.reviewCount || 0})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: '#667eea' }}
                    >
                      ₹{product.price || '0'}
                    </Typography>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: 'line-through', color: '#a0aec0' }}
                      >
                        ₹{product.originalPrice}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleShopNow}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              borderRadius: '25px',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2, #667eea)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Ready to Start Shopping?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}
            >
              Join thousands of students and educators who trust MeriStationary for their educational needs.
            </Typography>
            <MotionButton
              variant="contained"
              size="large"
              onClick={handleShopNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                borderRadius: '30px',
                boxShadow: '0 8px 25px rgba(238, 90, 36, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                  boxShadow: '0 12px 35px rgba(238, 90, 36, 0.4)'
                }
              }}
            >
              Explore Our Store
            </MotionButton>
          </Box>
        </Container>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          '&:hover': {
            background: 'linear-gradient(45deg, #764ba2, #667eea)'
          }
        }}
        onClick={() => navigate('/shop/cart')}
      >
        <Badge badgeContent={0} color="error">
          <ShoppingCart />
        </Badge>
      </Fab>
    </Box>
  );
};

export default ECommerceLanding;
