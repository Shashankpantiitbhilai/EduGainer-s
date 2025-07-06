import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce';

class ProductService {
  // Public product methods
  async getProducts(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products`, { params });
      console.log('ProductService - getProducts:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProduct(id) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchProducts(query, params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/search`, {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductReviews(productId, params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/${productId}/reviews`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRelatedProducts(productId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/${productId}/related`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin product methods
  async createProduct(productData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/admin/products`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(id, productData) {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/admin/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(id) {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/admin/products/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProductStock(productId, quantity) {
    try {
      // Stock updates should be done through inventory management
      const response = await axiosInstance.post(`${BASE_URL}/admin/inventory/${productId}/adjust-stock`, { 
        quantity,
        reason: 'Manual adjustment',
        type: 'adjustment'
      });
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

export default new ProductService();
