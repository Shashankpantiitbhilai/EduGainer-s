import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Visibility,
  School,
  MenuBook,
  Computer,
  Assignment
} from '@mui/icons-material';
import { formatCurrency, calculateDiscount, isInStock, getProductImageUrl } from '../../../utils/ecommerce/helpers';
import { PRODUCT_TYPES } from '../../../utils/ecommerce/constants';

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist = false,
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  const theme = useTheme();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist && onToggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView && onQuickView(product);
  };

  const getProductTypeIcon = (type) => {
    const iconMap = {
      'digital': <Computer />,
      'physical': <MenuBook />,
      'subscription': <School />,
      'course': <School />,
      'ebook': <MenuBook />,
      'software': <Computer />,
      'certificate': <Assignment />
    };
    return iconMap[type] || <School />;
  };

  // Handle backend data structure with better fallbacks
  const productName = product.name || product.title || 'Unnamed Product';
  const productDescription = product.shortDescription || product.description || '';
  const originalPrice = product.price?.original || product.originalPrice || 0;
  const sellingPrice = product.price?.selling || product.price || product.sellingPrice || 0;
  const productImages = product.images || [];
  const primaryImage = productImages.find(img => img.isPrimary) || productImages[0];
  const imageUrl = primaryImage?.url || getProductImageUrl(product) || '/api/placeholder/300/200';
  const productType = product.productType || product.type || 'digital';
  const stockQuantity = product.inventory?.quantity || product.stock || 0;
  const isAvailable = product.inventory?.status === 'in-stock' || product.isActive !== false || stockQuantity > 0;
  const productRating = product.rating || product.averageRating || 4.0;
  const reviewCount = product.reviewCount || product.reviews?.length || 0;
  const productSku = product.sku || '';

  const discount = originalPrice > sellingPrice ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) : 0;
  const inStock = isAvailable;

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          '& .product-actions': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      {/* Product Image with Error Handling */}
      <Box sx={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
        <CardMedia
          component="img"
          height={variant === 'compact' ? 150 : 200}
          image={imageUrl}
          alt={productName}
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />

        {/* Product Type Badge */}
        <Chip
          icon={getProductTypeIcon(productType)}
          label={productType?.toUpperCase()}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <Chip
            label={`${discount}% OFF`}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: theme.palette.error.main,
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          />
        )}

        {/* Stock Status Badge */}
        {!inStock && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              textAlign: 'center',
              py: 1,
              fontWeight: 600
            }}
          >
            Out of Stock
          </Box>
        )}

        {/* Quick Actions */}
        <Box
          className="product-actions"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            opacity: 0,
            transform: 'translateY(10px)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Tooltip title="Quick View">
            <IconButton
              size="small"
              onClick={handleQuickView}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'white'
                }
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          <Tooltip title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
            <IconButton
              size="small"
              onClick={handleToggleWishlist}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: isInWishlist ? theme.palette.error.main : 'inherit',
                '&:hover': {
                  backgroundColor: 'white'
                }
              }}
            >
              {isInWishlist ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              Out of Stock
            </Typography>
          </Box>
        )}
      </Box>

      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            fontSize: variant === 'compact' ? '0.9rem' : '1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {productName}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={productRating} 
            precision={0.5} 
            readOnly 
            size="small"
            sx={{ mr: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            ({reviewCount})
          </Typography>
          {productSku && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {productSku}
            </Typography>
          )}
        </Box>

        {variant !== 'compact' && productDescription && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4
            }}
          >
            {productDescription}
          </Typography>
        )}

        {/* Price Section */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              fontSize: variant === 'compact' ? '1rem' : '1.25rem'
            }}
          >
            ₹{sellingPrice.toLocaleString()}
          </Typography>
          {originalPrice > sellingPrice && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}
            >
              ₹{originalPrice.toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* Stock Information */}
        {variant !== 'compact' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Chip
              label={inStock ? `${stockQuantity} in stock` : 'Out of stock'}
              size="small"
              color={inStock ? 'success' : 'error'}
              variant="outlined"
            />
            {product.inventory?.status === 'low-stock' && (
              <Chip
                label="Low Stock"
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </CardContent>

      {/* Action Buttons */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={!inStock}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            background: inStock 
              ? 'linear-gradient(45deg, #667eea, #764ba2)' 
              : 'grey.300',
            '&:hover': {
              background: inStock 
                ? 'linear-gradient(45deg, #764ba2, #667eea)' 
                : 'grey.400'
            }
          }}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </Box>
    </Card>
  );
};

export { ProductCard };
export default ProductCard;
