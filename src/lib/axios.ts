import axiosFactory from 'axios';
import { LOCAL_STORAGE, removeFromLocalStorage } from '../utils/localStorage';

const axios = axiosFactory.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    if (error.response.status === 401 && !error?.config?._isRetry) {
      try {
        removeFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA);
        window.location.reload();
      } catch (err) {
        console.log(`User not authorized ${err}`);
      }
    }
    if (error.response.status === 429) {
      throw new Error(error.response.status);
    }
    throw error;
  }
);

export default axios;
