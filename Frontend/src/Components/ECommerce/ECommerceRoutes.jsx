import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// User Components
import ECommerceLanding from './User/ECommerceLanding';
import ProductCatalog from './User/ProductCatalog';
import ProductDetails from './User/ProductDetails';
import CartPage from './User/CartPage';
import Checkout from './User/Checkout';
import UserAccount from './User/UserAccount';
import OrderTracking from './User/OrderTracking';
import Wishlist from './User/Wishlist';

// Admin Components
import AdminDashboard from './Admin/AdminDashboard';
import ProductManagement from './Admin/ProductManagement';
import OrderManagement from './Admin/OrderManagement';
import CategoryManagement from './Admin/CategoryManagement';
import CustomerManagement from './Admin/CustomerManagement';
import InventoryManagement from './Admin/InventoryManagement';
import CouponManagement from './Admin/CouponManagement';
import AnalyticsReports from './Admin/AnalyticsReports';

// Auth wrapper for admin routes
import ProtectedRoute from '../../Protection/ProtectedRoute';

const ECommerceRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin/ecommerce');

  return (
    <Routes>
      {isAdminRoute ? (
        // Admin Routes (Protected)
        <>
          <Route 
            path="/" 
            element={
              <ProtectedRoute >
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute >
                <ProductManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute >
                <OrderManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute >
                <CategoryManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <ProtectedRoute >
                <CustomerManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute >
                <InventoryManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/coupons" 
            element={
              <ProtectedRoute >
                <CouponManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute >
                <AnalyticsReports />
              </ProtectedRoute>
            } 
          />
        </>
      ) : (
        // Shop Routes (Public)
        <>
          <Route path="/" element={<ECommerceLanding />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:categoryId" element={<ProductCatalog />} />
          
          {/* User Account Routes (Protected) */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<UserAccount />} />
          <Route path="/orders" element={<OrderTracking />} />
          <Route path="/order/:orderId" element={<OrderTracking />} />
        </>
      )}
    </Routes>
  );
};

export { ECommerceRoutes };
export default ECommerceRoutes;
