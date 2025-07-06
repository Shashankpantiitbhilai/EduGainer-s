import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce';

class CategoryService {
  // Public category methods
  async getCategories(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/categories`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategoryHierarchy() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/categories/hierarchy`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategory(id) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategoryProducts(id, params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/categories/${id}/products`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin category methods
  async createCategory(categoryData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/categories`, categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/categories/${id}`, categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCategory(id) {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/categories/${id}`);
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

export default new CategoryService();
