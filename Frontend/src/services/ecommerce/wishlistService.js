import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce';

class WishlistService {
  // Get user's wishlist
  async getWishlist() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/wishlist`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add product to wishlist
  async addToWishlist(productId) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/wishlist/add`, {
        productId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove product from wishlist
  async removeFromWishlist(productId) {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/wishlist/item/${productId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if product is in wishlist (this endpoint doesn't exist in backend, we'll simulate it)
  async isInWishlist(productId) {
    try {
      const wishlist = await this.getWishlist();
      const items = wishlist.data?.items || [];
      return { data: { isInWishlist: items.some(item => item.product._id === productId) } };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Clear entire wishlist
  async clearWishlist() {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/wishlist/clear`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Move item from wishlist to cart
  async moveToCart(productId, quantity = 1) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/wishlist/move-to-cart/${productId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get wishlist statistics
  async getWishlistStats() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/wishlist/stats`);
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

export default new WishlistService();
