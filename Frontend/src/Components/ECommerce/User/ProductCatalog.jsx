import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Breadcrumbs,
  Link,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Badge,
  Fab,
  Chip
} from '@mui/material';
import {
  GridView,
  ViewList,
  Sort,
  FilterList,
  NavigateNext,
  Close,
  ShoppingCart,
  Favorite,
  AccountCircle,
  Category,
  Home,
  LocalOffer
} from '@mui/icons-material';
import { 
  ProductCard, 
  SearchBar, 
  ProductFilters, 
  ProductPagination 
} from '../Shared';
import { userProductService, userCategoryService } from '../../../services/ecommerce';
import { SORT_OPTIONS, VIEW_TYPES } from '../../../utils/ecommerce/constants';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';

const ProductCatalog = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Context hooks
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    itemCount, 
    wishlist,
    loading: cartLoading 
  } = useCart();
  const { showSuccess, showError } = useNotification();

  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.POPULARITY);
  const [viewType, setViewType] = useState(VIEW_TYPES.GRID);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 12,
    totalItems: 0
  });
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Get query parameters
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';

  // Load initial data and when URL search params change
  useEffect(() => {
    loadCategories();
    loadProducts(1); // Always start from page 1 when search params change
  }, [location.search]);

  // Load products when filters or sort change
  useEffect(() => {
    if (Object.keys(filters).length > 0 || sortBy !== SORT_OPTIONS.POPULARITY) {
      loadProducts(1); // Reset to page 1 when filters change
    }
  }, [filters, sortBy]);

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await userCategoryService.getCategories();
      if (response.success) {
        setCategories(response.data || response.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // Load products with enhanced error handling and response parsing
  const loadProducts = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: pagination.pageSize,
        sort: sortBy,
        ...filters
      };

      if (searchQuery) params.search = searchQuery;
      if (categoryId) params.category = categoryId;

      const response = await userProductService.getProducts(params);
      console.log(response?.data,"product-users")
      if (response.success) {
        // Handle different possible response structures from backend
        let products = [];
        let paginationData = {};

        if (response.data) {
          // If response has a data object
          products = response.data.products || response.data.data || response.data || [];
          paginationData = response.data.pagination || response.pagination || {};
        } else if (response.products) {
          // If products are directly in response
          products = response.products;
          paginationData = response.pagination || {};
        } else if (Array.isArray(response.data)) {
          // If data is directly an array
          products = response.data;
        } else {
          // Fallback
          products = [];
        }

        setProducts(products);
        
        // Enhanced pagination handling
        setPagination({
          currentPage: paginationData.currentPage || paginationData.page || page,
          totalPages: paginationData.totalPages || paginationData.pages || Math.ceil((paginationData.totalItems || paginationData.total || products.length) / pagination.pageSize),
          pageSize: paginationData.pageSize || paginationData.limit || pagination.pageSize,
          totalItems: paginationData.totalItems || paginationData.total || products.length
        });

        // Update breadcrumb if category is selected
        if (categoryId && categories.length > 0) {
          const selectedCategory = categories.find(cat => cat._id === categoryId || cat.id === categoryId);
          if (selectedCategory) {
            setBreadcrumb(generateBreadcrumb(selectedCategory));
          }
        } else {
          setBreadcrumb([]);
        }
      } else {
        throw new Error(response.message || 'Failed to load products');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load products. Please try again.';
      setError(errorMessage);
      console.error('Failed to load products:', error);
      setProducts([]);
      setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 0 }));
    } finally {
      setLoading(false);
    }
  };

  // Generate breadcrumb with enhanced category handling
  const generateBreadcrumb = (category) => {
    const crumbs = [{ name: 'Home', path: '/' }];
    if (category) {
      // Handle both _id and id for better compatibility
      const categoryId = category._id || category.id;
      crumbs.push({ 
        name: category.name || category.title, 
        path: `/products?category=${categoryId}` 
      });
    }
    return crumbs;
  };

  // Enhanced search with better parameter handling
  const handleSearch = useCallback((searchTerm) => {
    const params = new URLSearchParams();
    if (searchTerm?.trim()) params.set('search', searchTerm.trim());
    if (categoryId) params.set('category', categoryId);
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl);
  }, [categoryId, navigate]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({});
    setActiveFiltersCount(0);
    setSortBy(SORT_OPTIONS.POPULARITY);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Navigate to clean URL (keeping only search and category if they exist)
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (categoryId) params.set('category', categoryId);
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl);
  }, [searchQuery, categoryId, navigate]);

  // Enhanced filters handling with backend integration
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    // Count active filters more accurately
    const count = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (Array.isArray(value) && value.length > 0) return acc + value.length;
      if (typeof value === 'boolean' && value) return acc + 1;
      if (typeof value === 'number' && value > 0) return acc + 1;
      if (typeof value === 'string' && value.trim() !== '') return acc + 1;
      if (typeof value === 'object' && value !== null) {
        // Handle range filters like price
        if (value.min !== undefined || value.max !== undefined) return acc + 1;
      }
      return acc;
    }, 0);
    setActiveFiltersCount(count);
    
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    // Note: Don't call loadProducts here - let useEffect handle it with updated URL
  };

  // Enhanced sort handling
  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    // Reset to first page when sort changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    // Note: Don't call loadProducts here - it will be called by useEffect when filters change
  };

  // Handle view type change
  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  // Enhanced pagination handling
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    loadProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
    loadProducts(1);
  };

  // Handle product actions with context integration
  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
    } catch (error) {
      // Error handling is done in the cart context
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleWishlist = async (product) => {
    try {
      await toggleWishlist(product);
    } catch (error) {
      // Error handling is done in the cart context
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleQuickView = (product) => {
    // TODO: Implement quick view modal
    console.log('Quick view:', product);
    showSuccess('Quick view coming soon!');
  };

  const handleProductClick = (product) => {
    navigate(`/shop/product/${product._id || product.id}`);
  };

  // Refresh data function
  const handleRefresh = () => {
    setError(null);
    loadProducts(pagination.currentPage);
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from({ length: pagination.pageSize }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={40} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  // Render products grid with enhanced product handling
  const renderProductsGrid = () => {
    const gridSize = viewType === VIEW_TYPES.GRID 
      ? { xs: 12, sm: 6, md: 4, lg: 3 }
      : { xs: 12 };

    return (
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item {...gridSize} key={product._id || product.id}>
            <Box 
              sx={{ cursor: 'pointer' }}
              onClick={() => handleProductClick(product)}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={handleQuickView}
                variant={viewType === VIEW_TYPES.LIST ? 'detailed' : 'default'}
                isInWishlist={isInWishlist(product._id || product.id)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Navigation Header */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: theme.palette.primary.main }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{ color: 'white' }}
            >
              Home
            </Button>
            <Button
              startIcon={<Category />}
              onClick={() => navigate('/shop/categories')}
              sx={{ color: 'white' }}
            >
              Categories
            </Button>
            <Button
              startIcon={<LocalOffer />}
              onClick={() => navigate('/shop/offers')}
              sx={{ color: 'white' }}
            >
              Offers
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              startIcon={<Favorite />}
              onClick={() => navigate('/shop/wishlist')}
              sx={{ color: 'white' }}
            >
              Wishlist
              {wishlist.length > 0 && (
                <Chip
                  label={wishlist.length}
                  size="small"
                  sx={{ ml: 1, backgroundColor: 'error.main', color: 'white' }}
                />
              )}
            </Button>
            <Button
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/shop/cart')}
              sx={{ color: 'white' }}
            >
              Cart
              {itemCount > 0 && (
                <Chip
                  label={itemCount}
                  size="small"
                  sx={{ ml: 1, backgroundColor: 'error.main', color: 'white' }}
                />
              )}
            </Button>
            <Button
              startIcon={<AccountCircle />}
              onClick={() => navigate('/shop/account')}
              sx={{ color: 'white' }}
            >
              Account
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          {breadcrumb.map((crumb, index) => (
            <Link
              key={index}
              component={RouterLink}
              to={crumb.path}
              color="inherit"
              underline="hover"
            >
              {crumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Products'}
        </Typography>
        
        {/* Search Bar with current search term */}
        <Box sx={{ mb: 3, maxWidth: 600 }}>
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search for courses, books, software..."
            initialValue={searchQuery}
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Sidebar - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
              priceRange={{ min: 0, max: 10000 }}
              loading={loading}
            />
          </Grid>
        )}

        {/* Mobile Filters Drawer */}
        <Drawer
          anchor="left"
          open={filtersDrawerOpen}
          onClose={() => setFiltersDrawerOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 300,
              maxWidth: '85vw'
            }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setFiltersDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            priceRange={{ min: 0, max: 10000 }}
            isDrawer={true}
            onClose={() => setFiltersDrawerOpen(false)}
            loading={loading}
          />
        </Drawer>

        {/* Main Content */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          {/* Toolbar */}
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <Badge badgeContent={activeFiltersCount} color="primary">
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setFiltersDrawerOpen(true)}
                  >
                    Filters
                  </Button>
                </Badge>
              )}
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="text"
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ color: 'text.secondary' }}
                >
                  Clear Filters ({activeFiltersCount})
                </Button>
              )}
              
              <Typography variant="body1" color="text.secondary">
                {pagination.totalItems} product{pagination.totalItems !== 1 ? 's' : ''} found
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Sort */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort by"
                >
                  <MenuItem value={SORT_OPTIONS.POPULARITY}>Popularity</MenuItem>
                  <MenuItem value={SORT_OPTIONS.PRICE_ASC}>Price: Low to High</MenuItem>
                  <MenuItem value={SORT_OPTIONS.PRICE_DESC}>Price: High to Low</MenuItem>
                  <MenuItem value={SORT_OPTIONS.RATING_DESC}>Rating</MenuItem>
                  <MenuItem value={SORT_OPTIONS.CREATED_DESC}>Newest</MenuItem>
                  <MenuItem value={SORT_OPTIONS.NAME_ASC}>Name A-Z</MenuItem>
                </Select>
              </FormControl>

              {/* View Toggle */}
              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={handleViewTypeChange}
                size="small"
              >
                <ToggleButton value={VIEW_TYPES.GRID}>
                  <GridView />
                </ToggleButton>
                <ToggleButton value={VIEW_TYPES.LIST}>
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Paper>

          {/* Error State with Retry */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={handleRefresh}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Products Grid */}
          {loading ? renderLoadingSkeleton() : (
            <>
              {products.length > 0 ? (
                renderProductsGrid()
              ) : (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria or filters
                  </Typography>
                </Paper>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <ProductPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export { ProductCatalog };
export default ProductCatalog;
