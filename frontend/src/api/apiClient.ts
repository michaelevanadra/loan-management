import axios from 'axios';
import { BACKEND_API_URL } from '../helpers/config';

const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return { ...config, url: `/api${config.url}` };
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
