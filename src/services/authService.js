/**
 * authService.js
 * All authentication-related API calls.
 * TODO: Uncomment and connect to real backend endpoints.
 */
// import api from './api'

export const authService = {
  /**
   * Login with email & password
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string, user: object }>}
   */
  // login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Register a new user/company
   * @param {{ name, email, password, company }} data
   */
  // register: (data) => api.post('/auth/register', data),

  /**
   * Request password reset email
   * @param {{ email: string }} data
   */
  // forgotPassword: (data) => api.post('/auth/forgot-password', data),

  /**
   * Reset password with token
   * @param {{ token: string, password: string }} data
   */
  // resetPassword: (data) => api.post('/auth/reset-password', data),

  /**
   * Get currently authenticated user profile
   */
  // getMe: () => api.get('/auth/me'),

  /**
   * Logout (invalidate token server-side)
   */
  // logout: () => api.post('/auth/logout'),
}
