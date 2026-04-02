import axios from 'axios';

const BASE_URL = 'https://lkvp3hlz-3000.inc1.devtunnels.ms/api/v1';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.status && response.data.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
