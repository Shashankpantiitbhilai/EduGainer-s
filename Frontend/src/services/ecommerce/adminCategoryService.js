import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce/categories';

class AdminCategoryService {
  // Admin Category Management (includes all user methods plus admin operations)
  
  // Public methods (inherited functionality)
  async getCategories(params = {}) {
    try {
      const response = await axiosInstance.get(BASE_URL, { params });
      console.log('AdminCategoryService - getCategories:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategoryHierarchy(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/hierarchy`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategory(id) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategoryProducts(id, params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${id}/products`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin-only methods (require authentication)
  async createCategory(categoryData) {
    try {
      const response = await axiosInstance.post(BASE_URL, categoryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/${id}`, categoryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCategory(id) {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const status = error.response?.status || 500;
    console.error('AdminCategoryService Error:', { status, message, error });
    return new Error(`${status}: ${message}`);
  }
}

export default new AdminCategoryService();
