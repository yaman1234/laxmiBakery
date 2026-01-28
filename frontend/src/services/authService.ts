import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config/index';
import { User, LoginResponse } from '../hooks/useAuth';

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Create form data as expected by the backend
    const formData = new URLSearchParams();
    formData.append('username', email);  // Backend expects 'username' field for email
    formData.append('password', password);

    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, 
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    const { access_token } = response.data;
    localStorage.setItem(AUTH_TOKEN_KEY, access_token);
    
    // Set the token in axios headers for subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get<User>(`${API_BASE_URL}/api/auth/me`);
    return response.data;
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};

// Set up axios interceptor to add token to all requests
const token = authService.getToken();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService; 