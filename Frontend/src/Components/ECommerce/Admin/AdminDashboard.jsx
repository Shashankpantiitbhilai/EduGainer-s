import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Card, 
  CardContent,
  Alert,
  Skeleton,
  useTheme,
  useMediaQuery,
  Button,
  CardActions
} from '@mui/material';
import { 
  ShoppingCart, 
  Inventory, 
  People, 
  TrendingUp,
  Category,
  LocalOffer,
  ArrowForward,
  Settings,
  Analytics,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../../../services/ecommerce';

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getDashboardStats();
      
      if (response.success) {
        const data = response.data;
        
        const dashboardStats = [
          { 
            title: 'Total Orders', 
            value: data.totalOrders?.toLocaleString() || '0', 
            icon: <ShoppingCart />, 
            color: '#1976d2' 
          },
          { 
            title: 'Products', 
            value: data.totalProducts?.toLocaleString() || '0', 
            icon: <Inventory />, 
            color: '#2e7d32' 
          },
          { 
            title: 'Customers', 
            value: data.totalCustomers?.toLocaleString() || '0', 
            icon: <People />, 
            color: '#ed6c02' 
          },
          { 
            title: 'Revenue', 
            value: `₹${data.totalRevenue?.toLocaleString() || '0'}`, 
            icon: <TrendingUp />, 
            color: '#9c27b0' 
          },
          { 
            title: 'Categories', 
            value: data.totalCategories?.toLocaleString() || '0', 
            icon: <Category />, 
            color: '#d32f2f' 
          },
          { 
            title: 'Active Coupons', 
            value: data.activeCoupons?.toLocaleString() || '0', 
            icon: <LocalOffer />, 
            color: '#0288d1' 
          }
        ];
        
        setStats(dashboardStats);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      
      // Fallback to mock data
      const fallbackStats = [
        { title: 'Total Orders', value: '1,234', icon: <ShoppingCart />, color: '#1976d2' },
        { title: 'Products', value: '567', icon: <Inventory />, color: '#2e7d32' },
        { title: 'Customers', value: '890', icon: <People />, color: '#ed6c02' },
        { title: 'Revenue', value: '₹1,23,456', icon: <TrendingUp />, color: '#9c27b0' },
        { title: 'Categories', value: '12', icon: <Category />, color: '#d32f2f' },
        { title: 'Active Coupons', value: '8', icon: <LocalOffer />, color: '#0288d1' }
      ];
      setStats(fallbackStats);
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (stat, index) => (
    <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
      <Card 
        sx={{ 
          height: '100%',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[8]
          }
        }}
      >
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="rectangular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={20} />
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  backgroundColor: stat.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        E-Commerce Dashboard
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} - Showing fallback data
        </Alert>
      )}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => renderStatCard(stat, index))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              }
            }}
            onClick={() => navigate('/admin/ecommerce/products')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Inventory sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Manage Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add, edit, and organize your product catalog
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button size="small" endIcon={<ArrowForward />}>
                Go to Products
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              }
            }}
            onClick={() => navigate('/admin/ecommerce/categories')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Category sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Manage Categories
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organize products into categories and subcategories
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button size="small" endIcon={<ArrowForward />}>
                Go to Categories
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              }
            }}
            onClick={() => navigate('/admin/ecommerce/orders')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Assignment sx={{ fontSize: 48, color: theme.palette.success.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Manage Orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Process and track customer orders
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button size="small" endIcon={<ArrowForward />}>
                Go to Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              }
            }}
            onClick={() => navigate('/admin/ecommerce/analytics')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Analytics sx={{ fontSize: 48, color: theme.palette.info.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                View Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed reports and business insights
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button size="small" endIcon={<ArrowForward />}>
                Go to Analytics
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Recent activity feed and system notifications will be displayed here
        </Typography>
      </Paper>
    </Container>
  );
};

export { AdminDashboard };
export default AdminDashboard;
