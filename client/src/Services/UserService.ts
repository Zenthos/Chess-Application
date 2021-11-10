import axios from 'axios';

export const UserService = {
  getProfile: async (username: string) => {
    const response = await axios.post('/user/profile', username);

    await response.data;
  },
  getSearchResults: async (search: string) => {
    const response = await axios.post('/user/search', search);

    await response.data;
  },
};
