import axios from 'axios';

interface User {
  email: string;
  password: string;
}

export const AuthService = {
  login: async (user: User) => {
    const response = await axios.post('/user/login', user);

    return response.data;
  },
  register: async (user: User) => {
    const response = await axios.post('/user/register', user);

    return response.data;
  },
  getProfile: async (username: string) => {
    const response = await axios.post('/user/profile', username);

    return response.data;
  },
  logout: async () => {
    const response = await axios.get('/user/logout');

    return response.data;
  },
  isAuthenticated: async () => {
    const response = await axios.get('/user/authenticated');

    return response.data;
  }
};
