import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce';

class UserProductService {
  // Public/User Product Methods
  async getProducts(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products`, { params });
      console.log('UserProductService - getProducts:', response.data);
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

  async getFeaturedProducts(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/featured`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSaleProducts(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/sale`, { params });
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

  async uploadProductImages(images) {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await axiosInstance.post(`${BASE_URL}/products/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    console.error('UserProductService Error:', { status, message, error });
    return new Error(`${status}: ${message}`);
  }
}

export default new UserProductService();
