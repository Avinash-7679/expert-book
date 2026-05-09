import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add interceptor to simplify response handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const expertService = {
  getExperts: (params) => api.get('/experts', { params }),
  getExpertById: (id) => api.get(`/experts/${id}`),
};

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getBookingsByEmail: (email) => api.get('/bookings', { params: { email } }),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

export default api;
