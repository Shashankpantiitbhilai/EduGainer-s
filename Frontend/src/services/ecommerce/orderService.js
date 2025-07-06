import axiosInstance from '../axiosInstance';

const BASE_URL = '/ecommerce';

class OrderService {
  // Order management
  async createOrder(orderData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/orders/create`, orderData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyPayment(paymentData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/orders/verify-payment`, paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserOrders(params = {}) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/orders`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrder(orderId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async trackOrder(orderId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelOrder(orderId, reason) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async requestReturn(orderId, returnData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/orders/${orderId}/return`, returnData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async trackOrder(orderId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async requestReturn(orderId, returnData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/orders/${orderId}/return`, returnData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadInvoice(orderId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/orders/${orderId}/invoice`, {
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
    return new Error(`${status}: ${message}`);
  }
}

export default new OrderService();
