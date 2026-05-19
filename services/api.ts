import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, API_TIMEOUT } from './config';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
});

// Interceptor de request: agrega el token si existe
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('velo_jwt');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: si recibe 401, borra token y usuario
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('velo_jwt');
      await AsyncStorage.removeItem('velo_user');
    }
    return Promise.reject(error);
  }
);

export default api;
