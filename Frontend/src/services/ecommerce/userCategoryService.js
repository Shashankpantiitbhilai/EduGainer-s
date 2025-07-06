import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce/categories';

class UserCategoryService {
  // Public Category Methods
  async getCategories(params = {}) {
    try {
      const response = await axiosInstance.get(BASE_URL, { params });
      console.log('UserCategoryService - getCategories:', response.data);
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

  // Error handling
  handleError(error) {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const status = error.response?.status || 500;
    console.error('UserCategoryService Error:', { status, message, error });
    return new Error(`${status}: ${message}`);
  }
}

export default new UserCategoryService();
