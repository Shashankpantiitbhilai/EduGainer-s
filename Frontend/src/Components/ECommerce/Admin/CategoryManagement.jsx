import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Chip,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Breadcrumbs,
  Link,
  Tooltip,
  Badge,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Category as CategoryIcon,
  Inventory,
  ArrowBack,
  Visibility,
  VisibilityOff,
  Dashboard,
  Refresh,
  GridView,
  TableRows,
  Search,
  FilterList
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { adminCategoryService, adminProductService } from '../../../services/ecommerce';

const CategoryManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    isActive: true
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [categoryStats, setCategoryStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
    loadCategoryStats();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminCategoryService.getCategories({ includeInactive: true });
      
      if (response.success) {
        setCategories(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError(error.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryStats = async () => {
    try {
      // Load product counts for each category
      const stats = {};
      for (const category of categories) {
        try {
          const response = await adminProductService.getProducts({ 
            category: category._id, 
            limit: 1 
          });
          if (response.success) {
            stats[category._id] = response.data?.totalItems || response.pagination?.totalItems || 0;
          }
        } catch (error) {
          stats[category._id] = 0;
        }
      }
      setCategoryStats(stats);
    } catch (error) {
      console.error('Failed to load category stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadCategories(), loadCategoryStats()]);
    setRefreshing(false);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      parent: '',
      isActive: true
    });
    setDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      parent: typeof category.parent === 'object' ? category.parent._id : category.parent || '',
      isActive: category.isActive !== false
    });
    setDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const response = await adminCategoryService.deleteCategory(categoryId);
        if (response.success) {
          loadCategories();
          console.log('Category deleted successfully');
        } else {
          throw new Error(response.message || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert(`Failed to delete category: ${error.message}`);
      }
    }
  };

  const handleSaveCategory = async () => {
    try {
      const categoryData = {
        ...formData,
        parent: formData.parent || undefined
      };

      let response;
      if (editingCategory) {
        response = await adminCategoryService.updateCategory(editingCategory._id, categoryData);
      } else {
        response = await adminCategoryService.createCategory(categoryData);
      }

      if (response.success) {
        await loadCategories();
        await loadCategoryStats();
        setDialogOpen(false);
        console.log(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
      } else {
        throw new Error(response.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
      }
    } catch (error) {
      console.error(`Failed to ${editingCategory ? 'update' : 'create'} category:`, error);
      alert(`Failed to ${editingCategory ? 'update' : 'create'} category: ${error.message}`);
    }
  };

  // Enhanced filtering and search
  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchQuery || 
      category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && category.isActive !== false) ||
      (filterStatus === 'inactive' && category.isActive === false);
    
    return matchesSearch && matchesStatus;
  });

  const toggleCategoryStatus = async (category) => {
    try {
      const response = await adminCategoryService.updateCategory(category._id, {
        ...category,
        isActive: !category.isActive
      });
      
      if (response.success) {
        await loadCategories();
        console.log(`Category ${category.isActive ? 'deactivated' : 'activated'} successfully`);
      } else {
        throw new Error(response.message || 'Failed to update category status');
      }
    } catch (error) {
      console.error('Failed to update category status:', error);
      alert(`Failed to update category status: ${error.message}`);
    }
  };

  const handleFormChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFormSwitchChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const renderCategoryCard = (category) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[8]
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={category.image?.url}
              sx={{ 
                width: 56, 
                height: 56, 
                mr: 2,
                backgroundColor: theme.palette.primary.main
              }}
            >
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {category.name}
              </Typography>
              <Chip
                label={category.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={category.isActive ? 'success' : 'default'}
              />
            </Box>
          </Box>
          
          {category.description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {category.description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Inventory fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {category.productCount || 0} products
              </Typography>
            </Box>
            
            {category.parent && (
              <Typography variant="caption" color="text.secondary">
                Parent: {typeof category.parent === 'object' ? category.parent.name : category.parent}
              </Typography>
            )}
          </Box>
        </CardContent>
        
        <CardActions>
          <IconButton 
            size="small" 
            onClick={() => handleEditCategory(category)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDeleteCategory(category._id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderSkeleton = () => (
    Array.from({ length: 8 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
              <Box>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="text" width={60} height={20} />
              </Box>
            </Box>
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" width="60%" height={16} />
          </CardContent>
        </Card>
      </Grid>
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
            <CategoryIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Category Management
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Category Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage product categories, organize your store structure
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCategory}
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
            Add New Category
          </Button>
        </Box>
      </Paper>

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Grid View">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  <GridView />
                </IconButton>
              </Tooltip>
              <Tooltip title="Table View">
                <IconButton
                  onClick={() => setViewMode('table')}
                  color={viewMode === 'table' ? 'primary' : 'default'}
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  <TableRows />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ borderRadius: 2 }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Grid>
        </Grid>
        
        {/* Summary Stats */}
        <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Chip
            label={`Total: ${categories.length}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Active: ${categories.filter(c => c.isActive !== false).length}`}
            color="success"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Inactive: ${categories.filter(c => c.isActive === false).length}`}
            color="error"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Filtered: ${filteredCategories.length}`}
            color="info"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Categories Display */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {loading ? renderSkeleton() : filteredCategories.map(renderCategoryCard)}
        </Grid>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Parent</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Products</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 6 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton height={40} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, backgroundColor: '#667eea' }}>
                            {category.name?.charAt(0).toUpperCase() || 'C'}
                          </Avatar>
                          <Typography fontWeight={600}>{category.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {category.description?.substring(0, 100) || 'No description'}
                          {category.description?.length > 100 && '...'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {category.parent ? (
                          <Chip 
                            label={typeof category.parent === 'object' ? category.parent.name : category.parent}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">Root</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={categoryStats[category._id] || 0}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive !== false ? 'Active' : 'Inactive'}
                          color={category.isActive !== false ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title={category.isActive !== false ? 'Deactivate' : 'Activate'}>
                            <IconButton 
                              size="small"
                              onClick={() => toggleCategoryStatus(category)}
                              color={category.isActive !== false ? 'warning' : 'success'}
                            >
                              {category.isActive !== false ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Category">
                            <IconButton 
                              size="small"
                              onClick={() => handleEditCategory(category)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Category">
                            <IconButton 
                              size="small"
                              onClick={() => handleDeleteCategory(category._id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Empty State */}
      {!loading && filteredCategories.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery || filterStatus !== 'all' ? 'No categories match your criteria' : 'No categories found'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by creating your first category to organize your products'
            }
          </Typography>
          {(!searchQuery && filterStatus === 'all') && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddCategory}
              sx={{ borderRadius: 2 }}
            >
              Create First Category
            </Button>
          )}
        </Paper>
      )}

      {/* Dialog for Add/Edit Category */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={formData.name}
              onChange={handleFormChange('name')}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleFormChange('description')}
              margin="normal"
              multiline
              rows={3}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Parent Category</InputLabel>
              <Select
                value={formData.parent}
                onChange={handleFormChange('parent')}
                label="Parent Category"
              >
                <MenuItem value="">None (Top Level)</MenuItem>
                {categories
                  .filter(cat => cat._id !== editingCategory?._id) // Don't allow self as parent
                  .map(category => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleFormSwitchChange('isActive')}
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveCategory} 
            variant="contained"
            disabled={!formData.name.trim()}
            sx={{ borderRadius: 2 }}
          >
            {editingCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>

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
        onClick={handleAddCategory}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export { CategoryManagement };
export default CategoryManagement;
