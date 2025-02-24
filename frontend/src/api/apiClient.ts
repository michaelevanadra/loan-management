import axios from 'axios';
import { BACKEND_API_URL } from '../helpers/config';

const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  return { ...config, url: `/api${config.url}` };
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
