import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce';

class AnalyticsService {
  // Dashboard statistics (Admin only)
  async getDashboardStats() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/admin/analytics/dashboard`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSalesStats(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/admin/analytics/sales`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductStats(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/admin/analytics/products`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRevenueStats(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/admin/analytics/revenue`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCustomerStats(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/admin/analytics/customers`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getInventoryStats() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/analytics/inventory`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSalesReport(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/analytics/sales-report`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTopProducts(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/analytics/top-products`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTopCustomers(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/analytics/top-customers`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const status = error.response?.status || 500;
    return new Error(`${status}: ${message}`);
  }
}

export default new AnalyticsService();
