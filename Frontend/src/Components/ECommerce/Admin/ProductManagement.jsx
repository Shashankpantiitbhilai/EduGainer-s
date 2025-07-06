import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Breadcrumbs,
  Link,
  Divider,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList,
  ArrowBack,
  Dashboard,
  Inventory,
  Close,
  PhotoCamera,
  Save,
  Refresh
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { adminProductService, adminCategoryService } from '../../../services/ecommerce';

const ProductManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    price: {
      original: '',
      selling: '',
      currency: 'INR'
    },
    sku: '',
    productType: 'digital',
    inventory: {
      quantity: 0,
      lowStockThreshold: 5,
      trackQuantity: true,
      allowBackorder: false
    },
    status: 'draft',
    visibility: 'public',
    featured: false,
    images: [],
    tags: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  useEffect(() => {
    loadProducts();
  }, [page, rowsPerPage, searchTerm]);

  // Load categories only once on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await adminCategoryService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        includeInactive: true
      };

      const response = await adminProductService.getAllProducts(params);
      
      if (response.success) {
        const products = response.data.products || response.data || [];
        setProducts(products);
        setTotalCount(response.data.totalItems || products.length);
      } else {
        throw new Error(response.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setError(error.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      category: '',
      price: {
        original: '',
        selling: '',
        currency: 'INR'
      },
      sku: '',
      productType: 'digital',
      inventory: {
        quantity: 0,
        lowStockThreshold: 5,
        trackQuantity: true,
        allowBackorder: false
      },
      status: 'draft',
      visibility: 'public',
      featured: false,
      images: [],
      tags: [],
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      }
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      category: typeof product.category === 'object' ? product.category._id : product.category || '',
      price: {
        original: product.price?.original || '',
        selling: product.price?.selling || '',
        currency: product.price?.currency || 'INR'
      },
      sku: product.sku || '',
      productType: product.productType || 'digital',
      inventory: {
        quantity: product.inventory?.quantity || 0,
        lowStockThreshold: product.inventory?.lowStockThreshold || 5,
        trackQuantity: product.inventory?.trackQuantity !== false,
        allowBackorder: product.inventory?.allowBackorder || false
      },
      status: product.status || 'draft',
      visibility: product.visibility || 'public',
      featured: product.featured || false,
      images: product.images || [],
      tags: product.tags || [],
      seo: {
        metaTitle: product.seo?.metaTitle || '',
        metaDescription: product.seo?.metaDescription || '',
        keywords: product.seo?.keywords || []
      }
    });
    setDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      setSaving(true);
      
      const productData = {
        ...formData,
        price: {
          original: parseFloat(formData.price.original) || 0,
          selling: parseFloat(formData.price.selling) || 0,
          currency: formData.price.currency || 'INR'
        },
        inventory: {
          ...formData.inventory,
          quantity: parseInt(formData.inventory.quantity) || 0
        }
      };

      let response;
      if (editingProduct) {
        response = await adminProductService.updateProduct(editingProduct._id, productData);
      } else {
        response = await adminProductService.createProduct(productData);
      }

      if (response.success) {
        await loadProducts();
        setDialogOpen(false);
        console.log(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
      } else {
        throw new Error(response.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error(`Failed to ${editingProduct ? 'update' : 'create'} product:`, error);
      alert(`Failed to ${editingProduct ? 'update' : 'create'} product: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await adminProductService.deleteProduct(productId);
        if (response.success) {
          // Refresh the product list
          loadProducts();
          // Show success message (you could add a snackbar here)
          console.log('Product deleted successfully');
        } else {
          throw new Error(response.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert(`Failed to delete product: ${error.message}`);
      }
    }
  };

  const handleViewProduct = (product) => {
    // Open a detailed view dialog or navigate to shop view
    window.open(`/shop/product/${product._id}`, '_blank');
  };

  const handleToggleProductStatus = async (productId, currentStatus) => {
    try {
      const response = await adminProductService.toggleProductStatus(productId);
      
      if (response.success) {
        loadProducts(); // Refresh the list
        console.log('Product status updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Failed to update product status:', error);
      alert(`Failed to update product status: ${error.message}`);
    }
  };

  const getStatusChip = (product) => {
    const isActive = product.status === 'active';
    return (
      <Chip
        label={isActive ? 'Active' : 'Inactive'}
        color={isActive ? 'success' : 'default'}
        size="small"
      />
    );
  };

  const getStockChip = (product) => {
    const stock = product.inventory?.quantity || 0;
    const isInStock = stock > 0;
    
    return (
      <Chip
        label={isInStock ? `In Stock (${stock})` : 'Out of Stock'}
        color={isInStock ? 'success' : 'error'}
        size="small"
      />
    );
  };

  const renderProductRow = (product) => (
    <TableRow key={product._id} hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            variant="rounded"
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              SKU: {product.sku}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2">
          {typeof product.category === 'object' ? product.category.name : product.category}
        </Typography>
      </TableCell>
      
      <TableCell>
        <Chip
          label={product.productType?.toUpperCase() || 'DIGITAL'}
          size="small"
          variant="outlined"
        />
      </TableCell>
      
      <TableCell>
        <Box>
          <Typography variant="subtitle2" color="primary" fontWeight={600}>
            ₹{product.price?.selling?.toLocaleString() || '0'}
          </Typography>
          {product.price?.original > product.price?.selling && (
            <Typography
              variant="caption"
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              ₹{product.price.original.toLocaleString()}
            </Typography>
          )}
        </Box>
      </TableCell>
      
      <TableCell>{getStockChip(product)}</TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Switch
              checked={product.status === 'active'}
              onChange={() => handleToggleProductStatus(product._id, product.status)}
              size="small"
            />
          }
          label={product.status === 'active' ? 'Active' : 'Inactive'}
        />
      </TableCell>
      
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="View Product">
            <IconButton 
              size="small" 
              onClick={() => handleViewProduct(product)} 
              color="info"
              sx={{ 
                border: '1px solid currentColor',
                '&:hover': { backgroundColor: 'info.main', color: 'white' }
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Product">
            <IconButton 
              size="small" 
              onClick={() => handleEditProduct(product)} 
              color="primary"
              sx={{ 
                border: '1px solid currentColor',
                '&:hover': { backgroundColor: 'primary.main', color: 'white' }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleDeleteProduct(product._id)}
              sx={{ 
                border: '1px solid currentColor',
                '&:hover': { backgroundColor: 'error.main', color: 'white' }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );

  const renderSkeleton = () => (
    Array.from({ length: rowsPerPage }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={48} height={48} />
            <Box>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={16} />
            </Box>
          </Box>
        </TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </TableCell>
      </TableRow>
    ))
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Header with Breadcrumb */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8fafc', borderRadius: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component={RouterLink}
            to="/admin/ecommerce"
            color="inherit"
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Dashboard sx={{ mr: 0.5, fontSize: 20 }} />
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Inventory sx={{ mr: 0.5, fontSize: 20 }} />
            Product Management
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Product Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your product inventory, pricing, and availability
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadProducts}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddProduct}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #764ba2, #667eea)'
                }
              }}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={loadProducts}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Search and Filters */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{ borderRadius: 2 }}
                >
                  Advanced Filters
                </Button>
                <Chip
                  label={`${totalCount} Products`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Products Table */}
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? renderSkeleton() : products.map(renderProductRow)}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Enhanced Pagination */}
        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 0,
                paddingRight: 0
              }
            }}
          />
        </Box>
      </Paper>

      {/* Product Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <Typography variant="h6" fontWeight={600}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={handleFormChange('name')}
                required
                placeholder="Enter product name"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={handleFormChange('sku')}
                placeholder="e.g., PROD-001"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleFormChange('description')}
                multiline
                rows={3}
                placeholder="Enter detailed product description"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                value={formData.shortDescription}
                onChange={handleFormChange('shortDescription')}
                multiline
                rows={2}
                placeholder="Enter brief product summary (max 200 characters)"
                inputProps={{ maxLength: 200 }}
                helperText={`${formData.shortDescription.length}/200 characters`}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleFormChange('category')}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Product Type</InputLabel>
                <Select
                  value={formData.productType}
                  onChange={handleFormChange('productType')}
                  label="Product Type"
                >
                  <MenuItem value="digital">Digital</MenuItem>
                  <MenuItem value="physical">Physical</MenuItem>
                  <MenuItem value="subscription">Subscription</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Pricing */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                Pricing
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Original Price (₹)"
                type="number"
                value={formData.price.original}
                onChange={handleFormChange('price.original')}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Selling Price (₹)"
                type="number"
                value={formData.price.selling}
                onChange={handleFormChange('price.selling')}
                required
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>

            {/* Inventory */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                Inventory
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.inventory.quantity}
                onChange={handleFormChange('inventory.quantity')}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Low Stock Threshold"
                type="number"
                value={formData.inventory.lowStockThreshold}
                onChange={handleFormChange('inventory.lowStockThreshold')}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mt: 2 }}>
                Product Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleFormChange('status')}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Visibility</InputLabel>
                <Select
                  value={formData.visibility}
                  onChange={handleFormChange('visibility')}
                  label="Visibility"
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="password_protected">Password Protected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={handleFormChange('featured')}
                    color="primary"
                  />
                }
                label="Featured Product"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProduct}
            disabled={saving || !formData.name || !formData.description || !formData.shortDescription || !formData.category || !formData.sku || !formData.price.selling}
            startIcon={saving ? null : <Save />}
            sx={{
              px: 3,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2, #667eea)'
              }
            }}
          >
            {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export { ProductManagement };
export default ProductManagement;
