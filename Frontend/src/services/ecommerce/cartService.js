import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce';

class CartService {
  // Cart management
  async getCart() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/cart`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addToCart(productId, quantity = 1, variantId = null) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/cart/add`, {
        productId,
        quantity,
        variantId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/cart/item/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeFromCart(productId) {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/cart/item/${productId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async clearCart() {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/cart/clear`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async applyCoupon(couponCode) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/cart/coupon`, { couponCode });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeCoupon(couponCode) {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/cart/coupon/${couponCode}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async calculateShipping(shippingData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/cart/shipping`, shippingData);
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

export default new CartService();
