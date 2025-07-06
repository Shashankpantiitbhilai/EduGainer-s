import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce/admin';

class AdminProductService {
  // Admin Product Management
  async getAllProducts(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products`, { params });
      console.log('AdminProductService - getAllProducts:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProduct(productId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(productData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/products`, productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/products/${productId}`, productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async toggleProductStatus(productId) {
    try {
      const response = await axiosInstance.patch(`${BASE_URL}/products/${productId}/toggle-status`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkUpdateProducts(updates) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/products/bulk-update`, updates);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async importProducts(csvFile) {
    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      
      const response = await axiosInstance.post(`${BASE_URL}/products/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportProducts(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/export`, {
        params,
        responseType: 'blob'
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
    console.error('AdminProductService Error:', { status, message, error });
    return new Error(`${status}: ${message}`);
  }
}

export default new AdminProductService();
