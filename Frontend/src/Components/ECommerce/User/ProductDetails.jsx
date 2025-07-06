import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Rating,
  Divider,
  Tabs,
  Tab,
  Alert,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Assignment
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { userProductService } from '../../../services/ecommerce';
import { formatCurrency, isInStock } from '../../../utils/ecommerce/helpers';
import { ProductCard } from '../Shared';

const ProductDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userProductService.getProduct(id);
      if (response.success) {
        setProduct(response.data);
        loadRelatedProducts(response.data._id);
      }
    } catch (error) {
      setError('Failed to load product details');
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (productId) => {
    try {
      const response = await userProductService.getRelatedProducts(productId);
      if (response.success) {
        setRelatedProducts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load related products:', error);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    console.log('Add to cart:', { product, quantity });
  };

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    // TODO: Implement wishlist functionality
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={30} width="60%" />
            <Skeleton variant="text" height={60} width="40%" />
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" height={50} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Product not found'}
        </Alert>
      </Container>
    );
  }

  const inStock = isInStock(product);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ mb: 2 }}>
              <img
                src={product.images?.[selectedImage]?.url || '/images/placeholder-product.jpg'}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: 8
                }}
              />
            </Box>
            
            {product.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      cursor: 'pointer',
                      border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Category */}
            {product.category && (
              <Chip 
                label={product.category.name} 
                size="small" 
                sx={{ mb: 2 }}
              />
            )}

            {/* Title */}
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              {product.name}
            </Typography>

            {/* Rating */}
            {product.averageRating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.averageRating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.reviewCount} reviews)
                </Typography>
              </Box>
            )}

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h4" 
                component="span" 
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                {formatCurrency(product.price)}
              </Typography>
              {product.originalPrice > product.price && (
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ 
                    ml: 2, 
                    textDecoration: 'line-through', 
                    color: 'text.secondary' 
                  }}
                >
                  {formatCurrency(product.originalPrice)}
                </Typography>
              )}
            </Box>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              <Chip 
                label={inStock ? 'In Stock' : 'Out of Stock'} 
                color={inStock ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>

            {/* Short Description */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {product.shortDescription || product.description}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!inStock}
                sx={{ flex: 1, minWidth: 200 }}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={isInWishlist ? <Favorite /> : <FavoriteBorder />}
                onClick={handleToggleWishlist}
                color={isInWishlist ? 'error' : 'primary'}
              >
                Wishlist
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<Share />}
              >
                Share
              </Button>
            </Box>

            {/* Features */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping color="primary" />
                <Typography variant="body2">Free Shipping</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                <Typography variant="body2">Secure Payment</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment color="primary" />
                <Typography variant="body2">7 Day Return</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ borderRadius: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 2 }}>
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
          </Tabs>
          
          <Divider />
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {product.description}
              </Typography>
            )}
            
            {activeTab === 1 && (
              <Box>
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 150 }}>
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No specifications available
                  </Typography>
                )}
              </Box>
            )}
            
            {activeTab === 2 && (
              <Typography variant="body1" color="text.secondary">
                Reviews component will be implemented here
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={relatedProduct._id}>
                <ProductCard
                  product={relatedProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export { ProductDetails };
export default ProductDetails;
